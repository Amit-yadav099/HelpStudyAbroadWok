'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  TablePagination,
  Typography,
} from '@mui/material';
import { 
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon 
} from '@mui/icons-material';
import { User } from '@/src/types/user';
import Link from 'next/link';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const UserTable = React.memo(function UserTable({ 
  users, 
  isLoading, 
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}: UserTableProps) {
  const memoizedUsers = useMemo(() => users, [users]);

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  if (isLoading && users.length === 0) {
    return (
      <Typography align="center" sx={{ py: 4 }}>
        Loading users...
      </Typography>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <Typography align="center" sx={{ py: 4 }}>
        No users found
      </Typography>
    );
  }

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memoizedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar 
                      src={user.image} 
                      alt={`${user.firstName} ${user.lastName}`}
                      sx={{ width: 40, height: 40 }}
                    />
                    <div>
                      <Typography variant="body1" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Age: {user.age}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{user.email}</Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{user.phone}</Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.gender}
                    color={user.gender === 'male' ? 'primary' : 'secondary'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {user.company.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.company.department}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    href={`/users/${user.id}`}
                    color="primary"
                    size="small"
                    title="View Details"
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});

export default UserTable;