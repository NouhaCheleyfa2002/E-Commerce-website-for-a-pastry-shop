import React from "react";
import { Box, useTheme, Alert, CircularProgress } from "@mui/material";
import { useGetUserPerformanceQuery } from "../../state/api";
import { useContext } from "react";
import { LoginContext } from "../../../context/LoginContext"; // Adjust path as needed
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";

const Performance = () => {
  const theme = useTheme();
  const { user } = useContext(LoginContext);
  
  // Get userId from the user object stored in context
  // For testing: use a known user ID if _id is missing
  const userId = user?._id || "6830d44ba09b26f7796e4a7c"; // Replace with actual user ID
  
  // Debug logging
  console.log("Logged-in user from LoginContext:", user);
  console.log("User ID for affiliate stats:", userId);
  
  // Skip the query if userId is not available
  const { data, isLoading, error } = useGetUserPerformanceQuery(userId, {
    skip: !userId, // This prevents the query from running if userId is null/undefined
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value?.length || 0,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value || 0).toFixed(2)}`,
    },
  ];

  // Debug logging
  console.log("Logged-in user from LoginContext:", user);
  console.log("User ID for affiliate stats:", userId);
  console.log("Performance API response:", data);
  console.log("Affiliate sales data:", data?.sales);
  console.log("Affiliate stats:", data?.user?.affiliateStats);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="AFFILIATE PERFORMANCE"
        subtitle="Track your Affiliate Sales Performance Here"
      />
      
      {/* No user ID available */}
      {!userId && (
        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          No user ID found. Please make sure you're logged in.
        </Alert>
      )}

      {/* No affiliate sales data */}
      {userId && data && (!data.sales || data.sales.length === 0) && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          No affiliate sales data available. 
          {data.user?.affiliateStats ? 
            ` Found ${data.user.affiliateStats.affiliateSales?.length || 0} affiliate sale IDs, but no detailed sales data.` :
            " No affiliate stats found for this user."
          }
        </Alert>
      )}

      {/* Error handling */}
      {error && userId && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          Failed to load performance data: {error.status === 404 
            ? "Performance data not found for this user"
            : error.data?.message || "An error occurred"
          }
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Data grid */}
      {!error && userId && (
        <Box
          mt="40px"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
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
            rows={(data && data.sales) || []}
            columns={columns}
            noRowsOverlay={() => (
              <Box p={2} textAlign="center">
                No affiliate sales performance data available
              </Box>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default Performance;