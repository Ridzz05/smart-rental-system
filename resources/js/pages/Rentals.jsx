import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Rentals() {
    const [rentals, setRentals] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // Notification State
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = () => {
        setLoading(true);
        fetch("/api/rentals")
            .then((res) => res.json())
            .then((data) => {
                setRentals(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching rentals:", err);
                showToast("Failed to load rentals logs", "error");
                setLoading(false);
            });
    };

    const showToast = (message, severity = "success") => {
        setToast({ open: true, message, severity });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, open: false });
    };

    const handleProcessReturn = async (rentalId) => {
        setProcessingId(rentalId);
        try {
            const response = await fetch(`/api/rentals/${rentalId}/return`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            const data = await response.json();
            if (response.ok) {
                showToast(
                    "Vehicle returned successfully and marked available!",
                );
                fetchRentals();
            } else {
                showToast(data.message || "Failed to process return", "error");
            }
        } catch (err) {
            console.error(err);
            showToast(
                "A connection error occurred during return processing",
                "error",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    const filteredRentals = rentals.filter((r) => {
        if (statusFilter === "All") return true;
        return r.status === statusFilter;
    });

    const getStatusChipColor = (status) => {
        switch (status) {
            case "Ongoing":
                return "info";
            case "Completed":
                return "success";
            case "Cancelled":
                return "error";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                }}
            >
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 800,
                        }}
                    >
                        Rental Ledger Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor, manage active rentals, and record customer
                        returns.
                    </Typography>
                </Box>

                {/* Status Filter */}
                <TextField
                    select
                    label="Filter Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: 180,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                    }}
                >
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Ongoing">Ongoing (Rented)</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
            </Box>

            {/* Table Log Ledger */}
            <Card
                sx={{
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
                }}
            >
                <TableContainer
                    component={Paper}
                    sx={{ border: "none", boxShadow: "none" }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead
                            sx={{
                                bgcolor: (theme) =>
                                    theme.palette.mode === "light"
                                        ? "#f8fafc"
                                        : "#1e1e24",
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Log ID
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Vehicle
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Customer
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Rental Period
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Total Cost
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Status
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: 700 }}
                                    align="right"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRentals.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            color="text.secondary"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            No rental records found
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Try selecting a different status
                                            filter.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRentals.map((rental) => (
                                    <TableRow
                                        key={rental.id}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                #RN-
                                                {String(rental.id).padStart(
                                                    4,
                                                    "0",
                                                )}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Paid via:{" "}
                                                {rental.payment_method}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {rental.vehicle.brand}{" "}
                                                {rental.vehicle.model}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Plate:{" "}
                                                <strong>
                                                    {
                                                        rental.vehicle
                                                            .license_plate
                                                    }
                                                </strong>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {rental.customer.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Phone: {rental.customer.phone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 500 }}
                                                    >
                                                        {rental.start_date}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Pickup
                                                    </Typography>
                                                </Box>
                                                <KeyboardArrowRightIcon
                                                    sx={{
                                                        color: "text.secondary",
                                                        fontSize: 16,
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 500 }}
                                                    >
                                                        {rental.end_date}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Return
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: "primary.main",
                                                }}
                                            >
                                                {formatCurrency(
                                                    rental.total_amount,
                                                )}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {rental.total_days} Days
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={rental.status}
                                                color={getStatusChipColor(
                                                    rental.status,
                                                )}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {rental.status === "Ongoing" ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    disabled={
                                                        processingId ===
                                                        rental.id
                                                    }
                                                    startIcon={
                                                        <CheckCircleOutlineIcon />
                                                    }
                                                    onClick={() =>
                                                        handleProcessReturn(
                                                            rental.id,
                                                        )
                                                    }
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        fontWeight: 700,
                                                        px: 2,
                                                    }}
                                                >
                                                    {processingId === rental.id
                                                        ? "Processing..."
                                                        : "Process Return"}
                                                </Button>
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontStyle: "italic" }}
                                                >
                                                    Returned
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity={toast.severity}
                    sx={{ width: "100%", borderRadius: 2 }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
