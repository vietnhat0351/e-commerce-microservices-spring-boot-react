import React, { useEffect, useState } from 'react'
import AddressSelectorModal from '../../../../components/AddressSelectorModal';
import { Button, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const Address = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);

    const keycloak = useKeycloak();
    const [loading, setLoading] = useState(true);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        // call api to get addresses
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/get-user-address?userId=${keycloak.keycloak.idTokenParsed.sub}`, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }

        })
            .then(response => {
                setAddresses(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    }, []);

    const handleDeleteAddress = (addressId) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/delete-address`, {
            userId: keycloak.keycloak.idTokenParsed.sub,
            addressId: addressId
        } , {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(response => {
                console.log('Address deleted:', response.data);
                setAddresses(addresses.filter(address => address.id !== addressId));
            })
            .catch(error => {
                console.error('Error deleting address:', error);
            });
    };


    return (
        <div>
            <h3>Địa chỉ</h3>
            <Button variant="contained" color="primary" onClick={handleOpenModal} style={{margin: 10}}>
                Thêm Địa Chỉ
            </Button>
            <AddressSelectorModal open={isModalOpen} handleClose={handleCloseModal} setter={setAddresses} />
            <Divider style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }} />
            {loading ? <CircularProgress /> : addresses.map(address => (
                <div key={address.id} style={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottom: '1px solid #ccc' }}>
                    <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", flex: 10, padding: 10, gap: 5 }}>
                        <strong>{address.recipientName} | {address.recipientPhone}</strong>
                        {address.street}, {address.ward}, {address.district}, {address.province}
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flex: 2 }}>
                        <Button variant="outlined" color="primary"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            Sửa
                        </Button>
                        <Button variant="outlined" color="error"
                            onClick={() => {
                                handleDeleteAddress(address.id);
                            }}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Address
