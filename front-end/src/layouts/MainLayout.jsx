import { Avatar, Badge, Button, Menu, MenuItem } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import React, { useEffect, useState } from 'react'
import { FaHome, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './Header.css'
import { useSelector } from 'react-redux';
import { GiHamburgerMenu } from "react-icons/gi";

const MenuCategory = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickCategory = (category) => {
    window.location.href = `/category/${category}`;
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ backgroundColor: "#3f51b5", color: "white", justifyContent: "center", alignItems: "center", display: "flex"}}
      >
        <GiHamburgerMenu size={20} style={{padding: 5}}/>
        Danh mục
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClickCategory("ram")}>RAM</MenuItem>
        <MenuItem onClick={() => handleClickCategory("cpu")}>CPU</MenuItem>
        <MenuItem onClick={() => handleClickCategory("gpu")}>GPU</MenuItem>
      </Menu>
    </div>
  );
}

const MainLayout = () => {

  // const cart = useSelector(state => state.cart.productIds);
  const cart = useSelector(state => state.cart);

  const Header = () => {
    const [isSticky, setIsSticky] = useState(false);
    const keycloak = useKeycloak();

    const [keyWord, setKeyWord] = useState('');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
      setQuery(e.target.value);
    };

    const handleSearch = () => {
      window.location.href = `/search?query=${query}`;
    };

    return (
      <header className={`header ${isSticky ? 'sticky' : ''}`}>
        <NavLink to="/" style={{ textDecoration: "none", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaHome style={{ width: 40, height: 40 }} />
            {/* <h2>Trang chủ</h2> */}
          </div>
        </NavLink>
        <MenuCategory />
        <div style={styles.container}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={styles.input}
            placeholder="Bạn cần tìm gì?"
          />
          <FaSearch style={styles.icon} 
            onClick={handleSearch}
          />
        </div>
        <Badge badgeContent={cart.productList.length} color="primary" style={{ cursor: "pointer" }}
          onClick={() => window.location.href = "/cart"}
        >
          <FaShoppingCart style={{ width: 25, height: 25 }} />
        </Badge>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {keycloak?.keycloak?.authenticated ? (
            <NavLink to={"/account"} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "white" }}>
              <Avatar alt={keycloak?.keycloak?.tokenParsed?.name} src={keycloak?.keycloak?.tokenParsed?.picture} sx={{ width: 40, height: 40 }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <b>Xin chào</b>
                <b>{keycloak?.keycloak?.tokenParsed?.name}</b>
              </div>
            </NavLink>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <FaUserCircle style={{ width: 40, height: 40 }} />
              <Button variant="contained" color="primary" onClick={() => keycloak?.keycloak?.login()}>Login</Button>
            </div>
          )}

        </div>
      </header>
    );
  };

  return (
    <div style={{ backgroundColor: "#eff4f8", display: "flex", flexDirection: "column" }}>
      <img src="..\..\images\Sub-Category-Banner.webp" alt="banner" style={{ width: "100%", height: 100 }} />
      <Header />
      <Outlet />
    </div>

  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '300px', // Đặt chiều rộng tùy ý cho input
  },
  input: {
    padding: '10px 40px 10px 10px', // Điều chỉnh padding để tránh biểu tượng
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%', // Chiếm toàn bộ chiều rộng container
  },
  icon: {
    position: 'absolute',
    right: '10px', // Đặt biểu tượng ở bên phải
    cursor: 'pointer',
    color: '#ccc',
  },
};

export default MainLayout;
