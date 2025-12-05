/*
Appears on every page
Consumes AuthContext to conditionally render UI based on login status
*/
import { Link, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useAuth } from "../AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();

  const displayName = user?.username || user?.name || user?.email || "User";

  // detect if admin account
  const isAdmin = user?.type === "admin" || user?.role === "admin";


  return (
    <AppBar position="sticky" color="black" elevation={0}>


      <Toolbar
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Logo / Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "primary.main",
            }}
          >
            MountainCourse
          </Typography>
        </Box>

        {/* Right side: links / user info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            component={NavLink}
            to="/"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Home
          </Button>


        {isAdmin && (
          <Button
            component={NavLink}
            to="/admin/users"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Users
          </Button>
        )}


          {!user && (
            <>
              <Button
                component={NavLink}
                to="/login"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
              <Button
                component={NavLink}
                to="/register"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Register
              </Button>
            </>
          )}

          {user && (
            <>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {displayName}{" "}
                {isAdmin && <span style={{ fontWeight: 600 }}>(admin)</span>}
              </Typography>
              <Button
                color="inherit"
                onClick={logout}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
