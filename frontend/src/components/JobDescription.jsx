import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      if (!user?.profile?.resume) {
        toast.error("Please upload your resume in Profile before applying.");
        return;
      }

      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          setIsApplied(
            res.data.job?.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  /* 🔒 HARD GUARD — prevents ALL undefined crashes */
  if (!singleJob || Object.keys(singleJob).length === 0) {
    return (
      <div className="max-w-7xl mx-auto my-10">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-lg sm:text-xl">{singleJob.title}</h1>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Badge className="text-blue-700 font-bold text-xs" variant="ghost">
              {singleJob.position} Positions
            </Badge>
            <Badge className="text-[#F83002] font-bold text-xs" variant="ghost">
              {singleJob.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-bold text-xs" variant="ghost">
              {singleJob.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`w-full sm:w-auto rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 text-sm sm:text-base">
        Job Description
      </h1>

      <div className="my-4 space-y-3">
        <h1 className="font-bold text-sm sm:text-base">
          Role:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800 break-words">
            {singleJob.title}
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Location:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {singleJob.location}
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Description:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800 break-words">
            {singleJob.description}
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Experience:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {singleJob.experienceLevel} yrs
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Salary:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {singleJob.salary} LPA
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Open Positions:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {singleJob.position}
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Total Applicants:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {singleJob.applications?.length || 0}
          </span>
        </h1>

        <h1 className="font-bold text-sm sm:text-base">
          Posted Date:
          <span className="pl-2 sm:pl-4 font-normal text-gray-800">
            {new Date(singleJob.createdAt).toLocaleDateString()}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
