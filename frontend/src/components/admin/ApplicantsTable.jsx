import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    // Generate server-side resume URL using public_id
    const getServerResumeUrl = (publicId) => {
        if (!publicId) return null;
        return `${USER_API_END_POINT}/resume/${publicId}`;
    };

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className='whitespace-nowrap'>FullName</TableHead>
                        <TableHead className='whitespace-nowrap'>Email</TableHead>
                        <TableHead className='whitespace-nowrap'>Contact</TableHead>
                        <TableHead className='whitespace-nowrap'>Resume</TableHead>
                        <TableHead className='whitespace-nowrap'>Date</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell className='whitespace-nowrap'>{item?.applicant?.fullname}</TableCell>
                                <TableCell className='whitespace-nowrap'>{item?.applicant?.email}</TableCell>
                                <TableCell className='whitespace-nowrap'>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    {
                                        item?.resumePublicId ? <a className="text-blue-600 cursor-pointer underline" href={getServerResumeUrl(item?.resumePublicId)} target="_blank" rel="noopener noreferrer">{item?.resumeOriginalName || "View Resume"}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable