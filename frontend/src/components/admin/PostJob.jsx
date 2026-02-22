import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const PostJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const isEditing = Boolean(jobId);

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    const job = res.data.job;
                    const requirementsText = Array.isArray(job?.requirements)
                        ? job.requirements.join(", ")
                        : job?.requirements || "";
                    const companyId = job?.company?._id || job?.company || "";

                    setInput({
                        title: job?.title || "",
                        description: job?.description || "",
                        requirements: requirementsText,
                        salary: job?.salary || "",
                        location: job?.location || "",
                        jobType: job?.jobType || "",
                        experience: job?.experienceLevel || "",
                        position: job?.position || 0,
                        companyId
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to load job details.");
            }
        };

        if (isEditing) {
            fetchJobDetails();
        }
    }, [isEditing, jobId]);

    const hasMissingFields = () => {
        const requiredFields = [
            input.title,
            input.description,
            input.requirements,
            input.salary,
            input.location,
            input.jobType,
            input.experience,
            input.position,
            input.companyId
        ];
        return requiredFields.some((field) => `${field}`.trim() === "");
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (companies.length === 0) {
                toast.error("Please register a company before posting a job.");
                return;
            }
            if (hasMissingFields()) {
                toast.error("Please fill all required fields.");
                return;
            }
            setLoading(true);
            const payload = {
                ...input,
                requirements: input.requirements.trim(),
                salary: `${input.salary}`.trim(),
                position: Number(input.position)
            };
            const requestConfig = {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            };

            const res = isEditing
                ? await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, payload, requestConfig)
                : await axios.post(`${JOB_API_END_POINT}/post`, payload, requestConfig);
            if(res.data.success){
                toast.success(res.data.message || (isEditing ? "Job updated successfully." : "Job posted successfully."));
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || (isEditing ? "Failed to update job. Please try again." : "Failed to post job. Please try again."));
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-full my-5 px-4'>
                <form onSubmit = {submitHandler} className='p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary (LPA range)</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="5-7"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level (years range)</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                placeholder="0-1"
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Postion</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        {companies.length > 0 && (
                            <Select value={input.companyId} onValueChange={selectChangeHandler}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Company" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company._id} value={company._id}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div> 
                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4" disabled={companies.length === 0}>
                            {isEditing ? "Update Job" : "Post New Job"}
                        </Button>
                    )}
                    {
                        companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>*Please register a company first, before posting a jobs</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob