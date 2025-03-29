import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from '../images/logo.png';

const links: any = {
  Source: 'https://github.com/Itay-Ash/DevopsLab/tree/main/code/Web/Frontend', 
  Project: 'https://github.com/Itay-Ash/DevopsLab', 
  Profile: 'https://github.com/Itay-Ash'
}

function TopNav() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [hovered, setHovered] = React.useState(false)

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleGithubLinkClick = (event: React.MouseEvent<HTMLElement>) => {  
    handleCloseUserMenu();
    window.open(event.currentTarget.dataset.url, '_blank');
  }
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRestartButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    window.location.reload();
  }

  return (
    <AppBar position="static">
      <Container style={{ height: '5vh', maxWidth:'100%'}} >
        <Toolbar disableGutters style={{  minHeight: '5vh', maxHeight: '5vh'}}>
          {/* Pc Website Logo and text */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1.5, mb: 0.4, ml:-1 }}>
            <img src={logo} width={'35'}/>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="https://itay-ash.github.io/DevopsLab/"
            target='_blank'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DevopsLab
          </Typography>
          {/* Phone Website Reload */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} onClick={handleRestartButtonClick}>
            <RestartAltIcon
              component= 'svg'
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}/>
          </Box>
          {/* Phone Website Logo and text */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 0.5, mb: 0.4, ml:-1 }}>
            <img src={logo} width={'35'}/>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="https://itay-ash.github.io/DevopsLab/"
            target='_blank'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DevopsLab
          </Typography>
          {/* Pc Website Trivia */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontFamily: 'Roboto Mono',
                fontWeight: 500,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: 40,
              }}
            >
              TЯIVIA
            </Typography>
          </Box>

          
          {/* Github Logo */}
          <Box sx={{ ml: 'auto'}}>
            <Tooltip title="See Github" 
              onClick={handleOpenUserMenu}>
              <GitHubIcon
              component= "svg" 
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              sx={{ p: 0,}} 
              fontSize='large'/>
            </Tooltip>
            <Menu
              sx={{ mt: '35px' }}
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
              {Object.keys(links).map((key, index) => (
                <MenuItem key={key} data-url={links[key]} onClick={handleGithubLinkClick}>
                  <Typography sx={{ textAlign: 'center' }}>{key}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopNav;
