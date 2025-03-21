import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';

export const MainListItems = () => (
  <React.Fragment>
    <ListItemButton component={RouterLink} to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/profile">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/students-management"> 
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Students" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/tutors-management"> 
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Tutors" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/booking">
      <ListItemIcon>
        <AccountBalanceWalletIcon />
      </ListItemIcon>
      <ListItemText primary="Bookings" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/transactions">
      <ListItemIcon>
        <AccountBalanceWalletIcon />
      </ListItemIcon>
      <ListItemText primary="Transactions" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/subject-level">
      <ListItemIcon>
        <CastForEducationIcon />
      </ListItemIcon>
      <ListItemText primary="Subjects &amp; Levels" />
    </ListItemButton>
  </React.Fragment>
);

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: 'brown',
  color: 'white',
  '&:hover': {
    backgroundColor: 'brown',
  },
}));

export const SecondaryListItems = ({ logout }) => (
  <React.Fragment>
    <CustomListItemButton  onClick={logout}>
      <ListItemIcon>
      </ListItemIcon>
      <div style={{marginLeft:"18px"}}>
      <ListItemText  primary="Logout" />
      </div>
    </CustomListItemButton >
  </React.Fragment>
);


