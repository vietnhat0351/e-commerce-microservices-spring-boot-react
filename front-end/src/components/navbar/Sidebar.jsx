import { Avatar, Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import { FaBoxes, FaChartBar, FaShoppingCart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarItems = [
  {
    id: 0,
    icon: <RiDashboardHorizontalFill />,
    label: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: 1,
    icon: <FaShoppingCart />,
    label: 'Orders',
    route: 'orders',
  },
  {
    id: 2,
    icon: <FaBoxes />,
    label: 'Products',
    route: 'products',
  },
  {
    id: 3,
    icon: <FaCircleUser />,
    label: 'Users',
    route: 'users',
  },
  {
    id: 4,
    icon: <FaChartBar />,
    label: 'Analytics',
    route: 'analytics',
  }
]

const Sidebar = () => {

  const keycloak = useKeycloak();

  const navigate = useNavigate();

  return (
    <Drawer
      sx={styles.drawer}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        flexDirection: 'column',
      }}>
        <Avatar
          alt={keycloak?.keycloak?.tokenParsed?.name}
          src={keycloak?.keycloak?.tokenParsed?.picture}
          sx={{ width: 70, height: 70 }}
        />
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: '600',
          fontSize: '16px',
          marginLeft: '10px',
        }}>
          {keycloak?.keycloak?.tokenParsed?.name}
        </p>
      </div>
      <Divider style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }} />
      <List>
        {SidebarItems.map((item, index) => (
          <ListItem
            button

            key={item.id}
            onClick={() => navigate(item.route)}
          >
            <ListItemIcon
              sx={styles.icons}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={styles.text}
              primary={item.label}
            />
          </ListItem>
        ))}
      </List>
      <Divider style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '20px 0',
        flexDirection: 'column',
        height: '100%',
      }}>

        <Button variant="contained" color="error"
          onClick={() => keycloak.keycloak.logout()}
        >
          Logout
        </Button>
      </div>
    </Drawer>

  );
};

const styles = {
  drawer: {
    width: 250,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 250,
      boxSizing: 'border-box',
      backgroundColor: '#101F33',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .Mui-selected': {
      color: 'red',
    },
  },
  icons: {
    color: 'rgba(255, 255, 255, 0.7)!important',
    marginLeft: '20px',
  },
  text: {
    '& span': {
      marginLeft: '-10px',
      fontWeight: '600',
      fontSize: '16px',
    }
  }
};

export default Sidebar;
