import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import moment from "moment";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import getEndpoint from "../services/getEndpoint";
import { formatPrice } from "../services/formatPrice";

function preventDefault(event) {
  event.preventDefault();
}

export async function GetAllTransactions() {
  const response = await axios.get(`${getEndpoint()}/api/Transaction/GetAll`);
  return response.data;
}

export default function Deposits({ transactions }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  const totalAmount = transactions.reduce((accumulator, currentValue) => {
    if(currentValue.type == "POST")
        return accumulator + currentValue.amount;
    else if(currentValue.type == "REFUND")
        return accumulator - currentValue.amount;
    else{
        return accumulator + ((currentValue.amount/0.8)*0.2);
    }
  }, 0);

  const handleClickOpen = async () => {
    const data = await GetAllTransactions();
    setAllTransactions(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bookingTransactions = allTransactions.filter(transaction =>transaction.type == "TRANSFER" && transaction.amount !== 10000);
  const postTransactions = allTransactions.filter(transaction => transaction.amount === 10000 && (transaction.type == "POST" || transaction.type == "REFUND"));

  return (
    <React.Fragment>
      <Title>Recent Transfers</Title>
      <Typography variant="h4">{formatPrice(totalAmount)} VNĐ</Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {moment().format('DD MMMM, YYYY')}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={handleClickOpen}>
          View
        </Link>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle><strong>Recent Transfers</strong></DialogTitle>
        <DialogContent>
          <Tabs value={value} onChange={handleChange} aria-label="transaction tabs">
            <Tab label="Bookings" />
            <Tab label="Posts" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>TransactionCode</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>CreateDate</TableCell>
                  <TableCell>Amount (20%) (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.transactionCode}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{moment(transaction.createdDate).format('DD-MM-yyyy')}</TableCell>
                    <TableCell sx={{ color: 'green' }}>
                        {"+ "+formatPrice((transaction.amount/0.8) * 0.2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>TransactionCode</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>CreateDate</TableCell>
                  <TableCell>Amount (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.transactionCode}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{moment(transaction.createdDate).format('DD-MM-yyyy')}</TableCell>
                    <TableCell sx={{ color: transaction.message === 'Transfer credit to admin' ? 'green' : 'red' }}>
                        {transaction.message === 'Transfer credit to admin' ? `+ ${formatPrice(transaction.amount)}` : `- ${formatPrice(transaction.amount)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
