import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link';
import _ from 'lodash';

const pages = [
  {
    label: 'Posts',
    link: '/',
    roles: ['user', 'admin']
  },
  {
    label: 'Create ad',
    link: '/create-post',
    roles: ['user', 'admin']
  },
  {
    label: 'Approve ads',
    link: '/approve',
    roles: ['admin']
  },
  {
    label: 'Categories',
    link: '/categories',
    roles: ['admin']
  }
];

function ResponsiveAppBar() {
  const likedPostsReducer = useSelector((state) => state.likedPostsReducer);
  const userReducer = useSelector((state) => state.userReducer);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.link} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href={page.link} variant="body2">
                      {page.label}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => _.includes(page.roles, userReducer.user.role) ? (
              <Button
                key={page.link}
                onClick={handleCloseNavMenu}
              >

                <Link href={page.link} variant="body2"
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.label}
                </Link>
              </Button>
            ) : null)}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Link href="/liked" variant="body2">
              <Badge badgeContent={likedPostsReducer.posts?.length} color="error">
                <StarIcon size="large" color="warning" />
              </Badge>
            </Link>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {pages.map((page) => _.includes(page.roles, userReducer.user.role) ? (
                <MenuItem key={page.link} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ) : null)}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;