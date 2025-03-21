import React, { useEffect, useState } from "react";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import { TableVirtuoso } from "react-virtuoso";
import { DeleteCredential, GetAllCredentials, UpdateApproveCredential, UpdateCredential } from "../../services/ApiServices/CredentialService";
import { SendStatusMailCredentials, GetUserInfo } from "../../services/ApiServices/UserService";

export function ModeratorHome() {
    const [credentials, setCredentials] = useState([]);
    const [selectedCredentialDetails, setSelectedCredentialDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const handleErrorSnackbarClose = (e) => {
        setOpenErrorSnackbar(false);
    }
    const fetchCredentials = async () => {
        try {
            let credentials = await GetAllCredentials();
            credentials = credentials.filter(credential => credential.status !== "ACTIVE" && credential.status !== "Rejected");
            setCredentials(credentials);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const acceptCredentials = async (credential) => {
        let tutorEmail = "";
        try {
            const cred = {
                id: credential.id,
                tutorId: credential.tutorId,
                subjectId: credential.subjectId,
                name: credential.name,
                type: credential.type,
                image: credential.image,
                status: "ACTIVE"
            };
            await UpdateApproveCredential(cred);

            const tutorInfo = await GetUserInfo(credential.tutorId); 
            tutorEmail = tutorInfo.email; 
            
            await fetchCredentials();
            await SendStatusMailCredentials({
                email: tutorEmail,
                status: "ACTIVE"
            });
        } catch (error) {
            //console.log(error)
            setOpenErrorSnackbar(true)
            setErrorMessage(
                error.response?.data?.message ||
                //error.response?.data?.error ||
                "An error occurred. Please try again later."
            );
        }
        
    };

    const rejectCredentials = async (credential) => {
        let tutorEmail = "";
        try {
            await DeleteCredential(credential.id);

            const tutorInfo = await GetUserInfo(credential.tutorId); 
            tutorEmail = tutorInfo.email; 

            
            await fetchCredentials();
            await SendStatusMailCredentials({
                email: tutorEmail,
                status: "Rejected"
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
        
    };

    const handleViewCredentialDetails = (credential) => {
        setSelectedCredentialDetails(credential);
    };

    useEffect(() => {
        fetchCredentials();
    }, []);

    const columns = [
        { width: 100, label: "Subject Name", dataKey: "subject.name" },
        { width: 100, label: "Name", dataKey: "name" },
        { width: 100, label: "Type", dataKey: "type" },
        { width: 100, label: "Status", dataKey: "status" },
        { width: 100, label: "Details", dataKey: "details" },
        { width: 100, label: "Actions", dataKey: "actions" },
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) =>
                column.dataKey !== "details" ? (
                    column.dataKey === "actions" ? (
                        <TableCell key={column.dataKey} text-align="center">
                            <Button
                                style={{ marginLeft: "7px" }}
                                variant="contained"
                                color="success"
                                onClick={() => acceptCredentials(row)}
                            >
                                Accept
                            </Button>
                            <Button
                                style={{ marginLeft: "7px" }}
                                variant="contained"
                                color="error"
                                onClick={() => rejectCredentials(row)}
                            >
                                Reject
                            </Button>
                        </TableCell>
                    ) : (
                        column.dataKey === "subject.name") ? (
                        <TableCell
                            key={column.dataKey}
                            align={column.numeric || false ? "right" : "left"}
                        >
                            {row["subject"] && row["subject"]["name"]}
                        </TableCell>

                    ) : (
                        <TableCell
                            key={column.dataKey}
                            align={column.numeric || false ? "right" : "left"}
                        >
                            {row[column.dataKey]}
                        </TableCell>
                    )) : (
                    <TableCell key={column.dataKey} text-align="center">
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewCredentialDetails(row)}
                        >
                            View
                        </Button>
                    </TableCell>
                )
            )}

        </>
    );
    return (
        <>
            <Box
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 1200,
                    width: "100%",
                    mt: 4,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5c6bc0",
                    }}
                >
                    Credentials
                </Typography>
                <Paper style={{ height: 400, width: "100%" }}>
                    <TableVirtuoso
                        data={credentials}
                        components={{
                            Scroller: TableContainer,
                            Table: (props) => (
                                <Table {...props} sx={{ borderCollapse: "separate" }} />
                            ),

                            TableRow: ({ item: _item, ...props }) => (
                                <TableRow {...props} />
                            ),
                            TableBody: React.forwardRef((props, ref) => (
                                <TableBody {...props} ref={ref} />
                            )),
                        }}
                        fixedHeaderContent={() => (
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.dataKey}
                                        align={column.numeric || false ? "right" : "left"}
                                        style
                                        ={{ width: column.width }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                        itemContent={rowContent}
                    />
                </Paper>
            </Box>
            <br />

            <Dialog
                open={selectedCredentialDetails !== null}
                onClose={() => setSelectedCredentialDetails(null)}
                aria-labelledby="credential-details-title"
            >
                <DialogTitle id="credential-details-title">
                    Credential Details
                </DialogTitle>
                <DialogContent>
                    {selectedCredentialDetails && (
                        <>
                            <Typography variant="body1">
                                <strong>Name:</strong> {selectedCredentialDetails.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Subject Name:</strong> {selectedCredentialDetails.subject && selectedCredentialDetails.subject.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Type:</strong> {selectedCredentialDetails.type}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong>{" "}
                                {selectedCredentialDetails.status ? "Active" : "Inactive"}
                            </Typography>
                            {selectedCredentialDetails.image && (
                                <img
                                    src={selectedCredentialDetails.image}
                                    alt="Credential"
                                    style={{ width: "100%", marginTop: 16 }}
                                />
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedCredentialDetails(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleErrorSnackbarClose}>
                <Alert onClose={handleErrorSnackbarClose} severity={"error"} sx={{ width: '100%' }}>
                  {errorMessage}
                </Alert>
              </Snackbar>

        </>
    )
}
