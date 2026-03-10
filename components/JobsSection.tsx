'use client';

import { useEffect, useState } from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  indeedLink: string;
  linkedinLink: string;
}

interface JobsSectionProps {
  desiredCareer?: string;
  city?: string;
}

export default function JobsSection({ desiredCareer = '', city = '' }: JobsSectionProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (desiredCareer.trim()) {
      fetchJobs();
    }
  }, [desiredCareer, city]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desiredCareer: desiredCareer.trim(),
          city: city || 'Remote',
        }),
      });

      const data = await response.json();
      setJobs(data);
      setHasData(true);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
    setLoading(false);
  };

  if (!hasData && !desiredCareer.trim()) {
    return (
      <div className="mb-12 glass rounded-xl p-8 text-center">
        <Briefcase size={32} className="mx-auto mb-4 text-amber-400" />
        <h3 className="text-lg font-semibold text-white mb-2">New Careers</h3>
        <p className="text-dark-400">
          Add your desired career in{' '}
          <a href="/preferences" className="text-amber-400 hover:underline">
            Preferences
          </a>{' '}
          to see curated job matches!
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-dark-400 mb-12">Loading jobs...</div>;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Briefcase size={24} className="text-amber-400" />
        <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
      </div>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-dark-400 text-sm">{job.company}</p>
                </div>
                <span className="bg-amber-600 bg-opacity-30 text-amber-400 px-2 py-1 rounded text-xs font-semibold">
                  {job.type}
                </span>
              </div>
              <p className="text-dark-500 text-sm mb-4">📍 {job.location}</p>
              <div className="flex space-x-2">
                <a
                  href={job.indeedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Indeed</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href={job.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                >
                  <span>LinkedIn</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center text-dark-400">
          <p>No jobs found. Update your career goals in Preferences!</p>
        </div>
      )}
    </div>
  );
}
