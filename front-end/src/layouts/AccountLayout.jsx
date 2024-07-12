import { Box, Button, Container } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import React, { useState } from 'react';
import { FaFileInvoice, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AccountLayout = () => {

    const url = new URL(window.location.href);

    // lấy ra pathname của url hiện tại kiểm tra xem navlink nào đang được active

    const [active, setActive] = useState(url.pathname);
    const navigate = useNavigate();

    const keycloak = useKeycloak();

    return (
        <Container style={{ display: "flex", gap: 10, padding: 10 }}>
            <Box sx={{ flex: 3, backgroundColor: "#fff", borderRadius: 2, display: "flex", flexDirection: "column", padding: 2, gap: 2 }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <img src={keycloak?.keycloak?.tokenParsed?.picture} alt={keycloak?.keycloak?.tokenParsed?.name} style={{ width: 40, height: 40 }} />
                    <b>{keycloak?.keycloak?.tokenParsed?.name} </b>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Button variant="text" style={{
                        color: active === "/account" ? "red" : "black",
                        display: "flex",
                        justifyContent: "flex-start",
                    }} startIcon={<FaUserCircle />}
                        onClick={() => {
                            setActive("/account")
                            navigate("/account");
                        }}>
                        <strong>Thông tin cá nhân</strong>
                    </Button>
                    <Button variant="text" style={{
                        color: active === "/account/addresses" ? "red" : "black",
                        display: "flex",
                        justifyContent: "flex-start",
                    }} startIcon={<FaLocationDot />}
                        onClick={() => {
                            setActive("/account/addresses")
                            navigate("/account/addresses");
                        }}>
                        <strong>Địa chỉ</strong>
                    </Button>
                    <Button variant="text" style={{
                        color: active === "/account/orders" ? "red" : "black",
                        display: "flex",
                        justifyContent: "flex-start",
                    }} startIcon={<FaFileInvoice />} onClick={() => {
                        setActive("/account/orders");
                        navigate("/account/orders");
                    }}>
                        <strong>Đơn hàng</strong>
                    </Button>
                    <Button variant="text" style={{ color: "black", 
                        display: "flex", justifyContent: "flex-start"
                     }} startIcon={<FaSignOutAlt />} onClick={() => keycloak.keycloak.logout({
                        redirectUri: window.location.origin
                     })}>
                        <strong>Đăng xuất</strong>
                    </Button>
                </div>
            </Box>
            <Box sx={{ flex: 9 }}>
                <Outlet />
            </Box>
        </Container>
    )
}

export default AccountLayout
