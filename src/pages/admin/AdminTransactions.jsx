import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import moment from "moment/moment";
import { GetAllTransactions } from "../../services/ApiServices/TransactionService";
import { formatPrice } from "../../services/formatPrice";

export function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [errorMessage, setErrorMessage] = useState();

    const fetchTransactions = async () => {
        try {
            const data = await GetAllTransactions();
            setTransactions(data);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="mb-8" style={{ minHeight: "80vh" }}>
            <Box className="transactions-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                    All Transactions
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="transaction table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>TransactionId</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Transfer Date</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{transaction.transactionCode}</TableCell>
                                    <TableCell>{transaction.message}</TableCell>
                                    <TableCell>{moment(transaction.createDate).format("DD-MM-YYYY")}</TableCell>
                                    <TableCell sx={{ color: transaction.message === 'Transfer credit to admin' ? 'green' : (transaction.message === 'Charge credit for user'? 'black':'red') }}>{
                                        transaction.message === 'Transfer credit to admin' ? `+ ${formatPrice(transaction.amount)}` :(transaction.message === 'Charge credit for user'? ` ${formatPrice(transaction.amount)}`:`- ${formatPrice(transaction.amount)}`)
                                    }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {errorMessage && (
                <Typography color="error" variant="body2">
                    {errorMessage}
                </Typography>
            )}
        </div>
    );
}
