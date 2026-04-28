import React from 'react';
import JobCard from './JobCard';
import { useJobs } from '../hooks/useJobs';

const JobsGrid = () => {
    const { jobs, loading, error } = useJobs();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading jobs</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-20">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default JobsGrid;
