import { useState, useEffect } from 'react';

// Placeholder data structure as requested
const MOCK_JOBS = [
    {
        id: '1',
        title: 'Senior React Developer',
        hourlyRateMin: 65,
        hourlyRateMax: 120,
        hiredThisMonth: 12,
        budget: 5000,
    },
    {
        id: '2',
        title: 'UX/UI Designer for Fintech',
        hourlyRateMin: 50,
        hourlyRateMax: 90,
        hiredThisMonth: 5,
        budget: 3200,
    },
    {
        id: '3',
        title: 'Senior Graphic Designer',
        hourlyRateMin: 40,
        hourlyRateMax: 75,
        hiredThisMonth: 22,
        budget: 2000,
    },
    {
        id: '4',
        title: 'Video Editor (reels/shorts)',
        hourlyRateMin: 35,
        hourlyRateMax: 60,
        hiredThisMonth: 18,
        budget: 1500,
    },
    {
        id: '5',
        title: 'Full Stack Node.js Engineer',
        hourlyRateMin: 80,
        hourlyRateMax: 150,
        hiredThisMonth: 8,
        budget: 8000,
    },
    {
        id: '6',
        title: 'Mobile App Developer (Flutter)',
        hourlyRateMin: 55,
        hourlyRateMax: 95,
        hiredThisMonth: 15,
        budget: 4500,
    },
    {
        id: '7',
        title: 'DevOps Engineer',
        hourlyRateMin: 90,
        hourlyRateMax: 160,
        hiredThisMonth: 3,
        budget: 6000,
        avatars: []
    },
    {
        id: '8',
        title: 'Product Manager',
        hourlyRateMin: 70,
        hourlyRateMax: 130,
        hiredThisMonth: 6,
        budget: 5500,

    },
    {
        id: '9',
        title: 'Motion Graphics Artist',
        hourlyRateMin: 45,
        hourlyRateMax: 85,
        hiredThisMonth: 9,
        budget: 4000,

    },
    {
        id: '10',
        title: 'Social Media Manager',
        hourlyRateMin: 25,
        hourlyRateMax: 50,
        hiredThisMonth: 30,
        budget: 1200,

    }
];

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call
        const fetchJobs = async () => {
            try {
                setLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // In a real app, this would be:
                // const response = await fetch('/api/jobs');
                // const data = await response.json();

                setJobs(MOCK_JOBS);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return { jobs, loading, error };
}
