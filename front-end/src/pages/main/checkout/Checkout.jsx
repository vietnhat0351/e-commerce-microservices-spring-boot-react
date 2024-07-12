import { Box, Button, Container } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressSelectorModal from '../../../components/AddressSelectorModal';
import { removeAllProducts } from '../../../redux/slices/cartSlice';
import { formatCurrencyVND } from '../../../utils/Utils';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const keycloak = useKeycloak();

    const [disabledButtonPayment, setDisabledButtonPayment] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState([
        { label: 'Thanh toán qua Momo', value: 'MOMO_WALLET' },
        { label: 'Thanh toán qua VNPay', value: 'VNPAY_WALLET' },
        { label: 'Thanh toán khi nhận hàng', value: 'COD' },
    ]);

    const cart = useSelector(state => state.cart)
    const [products, setProducts] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("MOMO_WALLET");

    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    useEffect(() => {
        const userId = keycloak?.keycloak?.subject;
        userId && axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/get-user-address?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(response => {
                setAddresses(response.data);
                setSelectedAddress(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });

        // call api to get products
        const requestProductIds = cart.productList.map(product => product.id);

        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/products/allByIdIn`, {
            ids: [...requestProductIds]
        })
            .then(response => {
                // console.log(response.data)
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }, [keycloak?.keycloak?.subject]);

    const calculateTotal = () => {
        let total = 0;
        cart.productList.forEach(product => {
            total += product?.quantity * products.find(p => p.id === product.id)?.price;
        });
        return Math.round(total * 100) / 100;
    }

    const placeOrder = () => {
        console.log('Place order');
        // call api to place order
        setDisabledButtonPayment(true);
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/orders/create`, {
            userId: keycloak.keycloak.idTokenParsed.sub,
            addressId: selectedAddress?.id,
            orderItems: cart.productList,
            paymentMethod: selectedPaymentMethod
        }, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(response => {
                console.log('Order placed:', response.data);
                const orderId = response.data.id;
                axios.post(`${process.env.REACT_APP_API_URL}/api/v1/payment/momo-pay`, {
                    orderId: orderId,
                    orderInfo: "Thanh toán đơn hàng",
                    extraData: "extra data"
                }, {
                    headers: {
                        Authorization: `Bearer ${keycloak.keycloak.token}`,

                    }
                })
                    .then(response => {
                        dispatch(removeAllProducts());
                        const paymentUrl = response.data;
                        // redirect to payment url
                        window.location.href = paymentUrl;

                    })
                    .catch(error => {
                        console.error('Error making payment:', error);
                    });
            })
            .catch(error => {
                console.error('Error placing order:', error);
            });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        (cart.productList.length > 0) ? (
            <div>
                <Container
                    sx={{ display: "flex", flexDirection: "column", gap: 10, backgroundColor: "#eff4f8", padding: 3, borderRadius: 2 }}

                >
                    <AddressSelectorModal open={isModalOpen} handleClose={handleCloseModal} setter={setAddresses} />
                    <div style={{ display: "flex", gap: 10 }}>
                        <Box sx={{
                            display: "flex",
                            flex: 9,
                            flexDirection: "column",
                            gap: 2,
                        }}>
                            <div style={{
                                backgroundColor: "#fff",
                                alignItems: "flex-start",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 5,
                                padding: 20,
                            }}>
                                <h4>Địa chỉ nhận hàng</h4>
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    flexDirection: "row",
                                    width: "100%",
                                    gap: 10,
                                }}>

                                    {addresses?.map(address =>
                                        <div key={address.id}
                                            style={{
                                                border: selectedAddress?.id === address.id ? "1px solid blue" : "1px solid rgba(255, 255, 255, 0.7)",
                                                cursor: "pointer",
                                                padding: 5,
                                                borderRadius: 2,
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "47%",
                                                backgroundColor: selectedAddress?.id === address.id ? "#f0f0f0" : "#fff"
                                            }}
                                            onClick={() => setSelectedAddress(address)}
                                        >
                                            <strong>{address.recipientName} | {address.recipientPhone}</strong>
                                            <div>{address.street}, {address.ward}, {address.district}, {address.province}</div>
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            border: "1px solid blue",
                                            cursor: "pointer",
                                            padding: 5,
                                            borderRadius: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "47%",
                                            backgroundColor: "#fff",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 5
                                        }}
                                        onClick={() => handleOpenModal()}
                                    >

                                        <FaPlus />
                                        <strong>Thêm địa chỉ</strong>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 5,
                                alignItems: "flex-start",
                                padding: 20,
                            }}>
                                <h2>Phương thức thanh toán</h2>
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    flexDirection: "row",
                                    gap: 10,
                                    width: "100%",
                                }}>
                                    {paymentMethod.map(method =>
                                        <div key={method.value} style={{
                                            border: selectedPaymentMethod === method.value ? "1px solid blue" : "1px solid rgba(255, 255, 255, 0.7)",
                                            cursor: "pointer",
                                            padding: 5,
                                            borderRadius: 2,
                                            display: "flex",
                                            width: "47%",
                                            backgroundColor: selectedPaymentMethod === method.value ? "#f0f0f0" : "#fff"
                                        }}
                                            onClick={() => setSelectedPaymentMethod(method.value)}
                                        >
                                            <strong>{method.label}</strong>
                                        </div>

                                    )}
                                </div>
                            </div>

                        </Box>
                        <Box sx={{
                            display: "flex",
                            flex: 3,
                            borderRadius: 2,
                            padding: 2,
                            backgroundColor: "#fff",
                            flexDirection: "column",
                        }}>
                            <h4>Thông tin đơn hàng</h4>
                            <div>
                                {
                                    products.map(product =>
                                        <div key={product.id} style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 10,
                                            padding: 10,
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                        }}>
                                            <img src={product.image} alt={product.name} style={{ maxWidth: 70, maxHeight: 70 }} />
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 5,
                                            }}>
                                                <div style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    fontSize: 10,
                                                    fontWeight: "bold",
                                                    textAlign: "left"
                                                }}>{product.name}</div>
                                                <div style={{
                                                    fontSize: 10,
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "flex-start"
                                                }}>
                                                    Giá: {formatCurrencyVND(product.price)} <br /> Số lượng: {cart.productList.find(p => p.id === product.id)?.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: 10,
                                borderTop: "1px solid rgba(0, 0, 0, 0.1)"
                            }}>
                                <div>Tạm tính:</div>
                                <div>
                                    {formatCurrencyVND(calculateTotal())}
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: 10,
                                borderTop: "1px solid rgba(0, 0, 0, 0.1)"
                            }}>
                                <div>Phí vận chuyển:</div>
                                <div>{formatCurrencyVND(0)}</div>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: 10,
                                borderTop: "1px solid rgba(0, 0, 0, 0.1)"
                            }}>
                                <div>Tổng cộng:</div>
                                <div>
                                    {formatCurrencyVND(calculateTotal())}
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: 10,
                                borderTop: "1px solid rgba(0, 0, 0, 0.1)"
                            }}>
                                <Button variant="contained" color="primary"
                                    onClick={() => {
                                        placeOrder();
                                        setIsPaymentLoading(true);
                                    }}
                                    disabled={disabledButtonPayment}
                                >
                                    {isPaymentLoading ? "Loading..." : "Thanh toán"}
                                </Button>
                            </div>
                        </Box>
                    </div>
                </Container>
            </div>
        ) : (
            <Container sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                backgroundColor: "#fff",
                height: "100%",
                padding: 10,
                marginTop: 2,
                borderRadius: 2
            }}>
                <div style={{
                    // lấy hình ảnh Empty-Cart.png từ thư mục images
                    backgroundImage: `url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f4.png)`,
                    backgroundSize: "cover",
                    width: 200,
                    height: 200,
                    backgroundRepeat: "no-repeat",
                }}></div>
                <div>
                    Giỏ hàng của bạn đang trống
                </div>
                <Button variant="contained" color="error" onClick={() => navigate('/products')}>
                    Mua sắm ngay
                </Button>
            </Container>
        )
    )
}

export default Checkout
