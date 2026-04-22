import React from 'react';
import { Chip } from '@mui/material';
import { JOB_TYPE_CONFIG, JobWorkingType } from '../../constants/jobConfig';

interface Job {
  _id: string;
  jobType: JobWorkingType; // Sử dụng enum đã định nghĩa
}

interface JobCardProps {
  job: Job;
}

const JobTypeCard: React.FC<JobCardProps> = ({ job }) => {
  const config = JOB_TYPE_CONFIG[job.jobType];

  return (
    <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{ borderRadius: 2 }}
    />
  );
};

export default JobTypeCard;
