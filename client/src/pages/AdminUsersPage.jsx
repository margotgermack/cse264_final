import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { getUsers, deleteUser, updateUserType } from "../api.js";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

function AdminUsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.type === "admin" || user?.role === "admin";

  // local state soring user list
  const [users, setUsers] = useState([]);
  // UI behavior flags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load all users on component mount
  useEffect(() => {
    // if you're not an admin, send away
    if (!isAdmin) {
      navigate("/");
      return;
    }

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [isAdmin, navigate]);

  // delete user handler
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  }

  // role update handler
  async function handleChangeType(id, newType) {
    try {
      const res = await updateUserType(id, newType);
      const updated = res.user ?? res;

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, type: updated.type } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user role.");
    }
  }

  // prevent non admin access
  if (!isAdmin) {
    return null; // brief flash before redirect
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username || u.email}</TableCell>
                <TableCell>
                {u.type === "admin" ? (
                  // Admin users: just display text, no editing
                  <Typography>admin</Typography>
                ) : (
                  // Student users: editable dropdown
                  <Select
                    size="small"
                    value={u.type || "student"}
                    onChange={(e) => handleChangeType(u.id, e.target.value)}
                    sx={{ minWidth: 110 }}
                  >
                    <MenuItem value="student">student</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                  </Select>
                )}
              </TableCell>

                <TableCell align="right">
                  <Button
                    color="error"
                    size="small"
                    variant="outlined"
                    onClick={() => handleDelete(u.id)}
                    sx={{ textTransform: "none" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default AdminUsersPage;
