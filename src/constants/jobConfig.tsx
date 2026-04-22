import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

// Định nghĩa các loại công việc bằng Enum để tránh viết sai text
export type JobWorkingType = 'fulltime' | 'parttime' | 'contract';

// Định nghĩa cấu trúc cho mỗi loại cấu hình
interface JobTypeDetail {
  label: string;
  icon: React.ReactElement;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  value: JobWorkingType;
}

// Record giúp đảm bảo bạn không thiếu bất kỳ loại JobType nào
export const JOB_TYPE_CONFIG: Record<JobWorkingType, JobTypeDetail> = {
  ["fulltime"]: {
    label: "Toàn thời gian",
    icon: <AccessTimeIcon fontSize="small" />,
    color: "primary",
    value: "fulltime",
  },
  ["parttime"]: {
    label: "Bán thời gian",
    icon: <TimerIcon fontSize="small" />,
    color: "warning",
    value: "parttime",
  },
  ["contract"]: {
    label: "Hợp đồng",
    icon: <WorkHistoryIcon fontSize="small" />,
    color: "success",
    value: "contract",
  },
};

export const JOB_TYPE_OPTIONS = Object.values(JOB_TYPE_CONFIG);
