import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Container,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Notifications,
  ExitToApp,
  AccountCircle,
  AddCircle,
  Dashboard as DashboardIcon,
  FiberManualRecord,
} from '@mui/icons-material';

const Layout = ({ children, darkMode, setDarkMode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Anchor states for user avatar menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // Anchor states for notifications popover
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications if user is authenticated
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/users/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNotif = (event) => {
    setAnchorElNotif(event.currentTarget);
    fetchNotifications();
  };
  const handleCloseNotif = () => setAnchorElNotif(null);

  const handleMarkNotifRead = async (id) => {
    try {
      await api.patch(`/users/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/users/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Items', path: '/products' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              onClick={() => navigate('/')}
              sx={{
                mr: 4,
                display: 'flex',
                fontWeight: 700,
                letterSpacing: '.5px',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Campus<span style={{ color: '#10b981' }}>Exchange</span>
            </Typography>

            {/* Nav Menu */}
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? 'secondary.main' : 'inherit',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Dark Mode Switcher */}
              <Tooltip title="Toggle theme">
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  {/* Notifications Popover Trigger */}
                  <IconButton color="inherit" onClick={handleOpenNotif}>
                    <Badge badgeContent={unreadCount} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>

                  {/* User Profile Avatar Dropdown */}
                  <Tooltip title="Open menu">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                      <Avatar
                        sx={{ bgcolor: 'secondary.main', color: 'white', width: 36, height: 36 }}
                        src={user?.profilePictureUrl ? `http://localhost:8080${user.profilePictureUrl}` : undefined}
                      >
                        {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  {/* User Actions Menu */}
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: { mt: 1.5, minWidth: 180 },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" noWrap fontWeight="bold">
                        {user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>My Dashboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/products/new'); }}>
                      <ListItemIcon><AddCircle fontSize="small" /></ListItemIcon>
                      <ListItemText>List an Item</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon><ExitToApp fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>

                  {/* Notifications Popover Container */}
                  <Popover
                    open={Boolean(anchorElNotif)}
                    anchorEl={anchorElNotif}
                    onClose={handleCloseNotif}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { width: 320, maxHeight: 400, mt: 1.5 } }}
                  >
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                      {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllRead}>Mark all read</Button>
                      )}
                    </Box>
                    <Divider />
                    <List sx={{ py: 0 }}>
                      {notifications.length === 0 ? (
                        <ListItem><ListItemText primary="No notifications yet" secondary="We will notify you here" /></ListItem>
                      ) : (
                        notifications.map((notif) => (
                          <ListItem
                            key={notif.id}
                            divider
                            sx={{
                              bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                              cursor: notif.isRead ? 'default' : 'pointer',
                            }}
                            onClick={() => !notif.isRead && handleMarkNotifRead(notif.id)}
                          >
                            {!notif.isRead && (
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <FiberManualRecord color="primary" sx={{ fontSize: 10 }} />
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={notif.content}
                              secondary={new Date(notif.createdAt).toLocaleDateString()}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: notif.isRead ? 400 : 600 }}
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Popover>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="text" color="inherit" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} CampusExchange. Created for college campus exchanges.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
