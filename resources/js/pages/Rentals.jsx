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

// i18n
import { useLanguage } from "../i18n/i18n";

export default function Rentals() {
    const { t } = useLanguage();
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
                showToast(t("rentals.toast_load_failed"), "error");
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
                showToast(t("rentals.toast_return_success"));
                fetchRentals();
            } else {
                showToast(data.message || t("rentals.toast_return_failed"), "error");
            }
        } catch (err) {
            console.error(err);
            showToast(t("rentals.toast_connection_error"), "error");
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

    const getStatusLabel = (status) => {
        switch (status) {
            case "Ongoing":
                return t("rentals.ongoing_rented");
            case "Completed":
                return t("rentals.completed");
            case "Cancelled":
                return t("rentals.cancelled");
            default:
                return status;
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
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "flex-end", sm: "space-between" },
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Google Sans", sans-serif',
                            fontWeight: 800,
                        }}
                    >
                        {t("rentals.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t("rentals.subtitle")}
                    </Typography>
                </Box>

                {/* Status Filter */}
                <TextField
                    select
                    label={t("rentals.filter_status")}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{
                        minWidth: { xs: "100%", sm: 180 },
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        alignSelf: { xs: "stretch", sm: "auto" }
                    }}
                >
                    <MenuItem value="All">{t("rentals.all_statuses")}</MenuItem>
                    <MenuItem value="Ongoing">{t("rentals.ongoing_rented")}</MenuItem>
                    <MenuItem value="Completed">{t("rentals.completed")}</MenuItem>
                    <MenuItem value="Cancelled">{t("rentals.cancelled")}</MenuItem>
                </TextField>
            </Box>

            {/* Table Log Ledger */}
            <Card>
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
                                    {t("rentals.log_id")}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {t("rentals.vehicle")}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {t("rentals.customer")}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {t("rentals.rental_period")}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {t("rentals.total_cost")}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    {t("rentals.status")}
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: 700 }}
                                    align="right"
                                >
                                    {t("rentals.actions")}
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
                                            {t("rentals.no_records")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {t("rentals.no_records_desc")}
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
                                                {t("rentals.paid_via")}:{" "}
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
                                                {t("dashboard.license_plate")}:{" "}
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
                                                        {t("rentals.pickup")}
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
                                                        {t("rentals.return")}
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
                                                {rental.total_days} {t("rental_desk.days")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(rental.status)}
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
                                                        ? t("rentals.processing")
                                                        : t("rentals.process_return")}
                                                </Button>
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontStyle: "italic" }}
                                                >
                                                    {t("rentals.returned")}
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
