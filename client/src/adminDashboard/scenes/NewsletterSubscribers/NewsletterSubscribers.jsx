import React, { useMemo, useState, useContext } from "react";
import { Box, IconButton, useTheme, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useGetNewsletterSubscribersQuery } from "../../state/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSVLink } from "react-csv";
import axios from "axios";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { LoginContext } from '../../../context/LoginContext';

const Newsletter = () => {
  const theme = useTheme();
  const {backendUrl} = useContext(LoginContext);
  const { data = [], isLoading, refetch } = useGetNewsletterSubscribersQuery();
  const [searchText, setSearchText] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      await axios.delete(`${backendUrl}/api/newsletter/${id}`);
      toast.success("Subscriber deleted");
      refetch();
    } catch (err) {
      toast.error("Failed to delete subscriber");
    }
  };

  const subscribers = Array.isArray(data) ? data : data?.subscribers || [];

const filteredData = useMemo(() => {
  return subscribers.filter((row) =>
    row.email.toLowerCase().includes(searchText.toLowerCase())
  );
}, [subscribers, searchText]);


  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
   
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Subscribed At",
      flex: 1,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete subscriber">
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon color="white" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const csvData = filteredData.map(({ name, email, createdAt }) => ({
    Name: name || "",
    Email: email,
    "Subscribed At": new Date(createdAt).toLocaleString(),
  }));

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="NEWSLETTER" subtitle="List of Subscribers" />

      {/* Search + Export */}
      <Box mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
        <TextField
          variant="outlined"
          placeholder="Search by email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "33%" },
            input: {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.default,
            },
          }}
        />
        <CSVLink
          data={csvData}
          filename={"newsletter-subscribers.csv"}
          className="bg-[#a37d5f] text-white px-4 py-2 rounded text-center self-start"
        >
          Export to CSV
        </CSVLink>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pagination
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
    </Box>
  );
};

export default Newsletter;
