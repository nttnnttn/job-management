import React from "react";
import AppButton from "../button/AppButton";
import { Button, Chip, Paper, Stack, Table } from "@mui/material";
import { Tag } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type Candidate = {
  _id: string;
  candidate: {
    fullName: string;
    email: string;
    skills?: string[];
  };
  status: "approved" | "rejected" | string;
  createdAt: string;
};

export interface CandidateTableProps {
  data: Candidate[];
  loadingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}

const CandidateTable: React.FC<CandidateTableProps> = ({
  data,
  loadingId,
  onApprove,
  onReject,
  isLoading,
}) => {

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      // Access nested candidate.fullName
      valueGetter: (value, row: Candidate) => row.candidate?.fullName || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (value, row: Candidate) => row.candidate?.email || "N/A",
    },
    {
      field: "skills",
      headerName: "Skills",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const skills = params.row.candidate?.skills;
        return Array.isArray(skills) && skills.length > 0 ? (
          <Stack direction="row" spacing={1}>
            {skills.map((skill: string) => (
              <Chip key={skill} label={skill} size="small" />
            ))}
          </Stack>
        ) : "N/A";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value;
        return (
          <Chip
            label={value}
            color={value === "approved" ? "success" : value === "rejected" ? "error" : "primary"}
            size="small"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Applied At",
      width: 200,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const item = params.row;
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={loadingId !== null || item.status === "approved"}
              onClick={() => onApprove(item._id)}
            >
              {loadingId === item._id + "approved" ? "..." : "Approve"}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={loadingId !== null || item.status === "rejected"}
              onClick={() => onReject(item._id)}
            >
              {loadingId === item._id + "rejected" ? "..." : "Reject"}
            </Button>
          </Stack>
        );
      },
    },
  ];


  return (
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={data}                // Antd 'dataSource'
        columns={columns}       // Antd 'columns'
        getRowId={(row) => row._id} // Antd 'rowKey'
        loading={isLoading}        // Antd 'loading'
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8 }, // Antd 'pagination'
          },
        }}
        pageSizeOptions={[8, 10, 25]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default CandidateTable;