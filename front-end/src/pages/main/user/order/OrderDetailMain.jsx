import { CircularProgress, Divider } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import { formatCurrencyVND, formatDateTime } from '../../../../utils/Utils';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  text-align: left;
`;

const Th = styled.th`
  background-color: #f4f4f4;
  border: 1px solid #dddddd;
  padding: 8px;
`;

const Td = styled.td`
  border: 1px solid #dddddd;
  padding: 8px;
`;

const TfootTd = styled(Td)`
  font-weight: bold;
  background-color: #f9f9f9;
`;

const OrderItemTable = ({ items }) => {
    // Tính tổng tiền của mỗi sản phẩm và tổng tiền tất cả các sản phẩm
    const productsWithTotalPrice = items.map(item => ({
        ...item?.product,
        totalPrice: item?.quantity * item?.product?.price,
        quantity: item?.quantity,
    }));

    const grandTotal = productsWithTotalPrice.reduce((sum, product) => sum + product.totalPrice, 0);

    return (
        <Table className="table">
            <thead>
                <tr>
                    <Th>Tên sản phẩm</Th>
                    <Th>Số lượng</Th>
                    <Th>Đơn giá</Th>
                    <Th>Thành tiền</Th>
                </tr>
            </thead>
            <tbody>
                {productsWithTotalPrice.map((product, index) => (
                    <tr key={index}>
                        <Td>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                            }}>
                                <img src={product.image} alt={product.name} style={{ width: 70, height: 50 }} />
                                <div>{product.name}</div>
                            </div>
                        </Td>
                        <Td>{product.quantity}</Td>
                        <Td>{formatCurrencyVND(product.price)}</Td>
                        <Td>{formatCurrencyVND(product.totalPrice)}</Td>
                    </tr>
                ))}
            </tbody>
            <TfootTd>
                <tr>
                    <Td colSpan="3">Tổng tiền</Td>
                    <Td>{formatCurrencyVND(grandTotal)}</Td>
                </tr>
            </TfootTd>
        </Table>
    );
};

const OrderDetailMain = () => {
    const orderId = window.location.pathname.split("/").pop();
    const keycloak = useKeycloak();
    const [isFetching, setIsFetching] = React.useState(true);

    const orderStatus = new Map([
        ["CANCELLED", {
            name: "Đã hủy",
            color: "red",
        }],
        ["PENDING", {
            name: "Đang chờ thanh toán",
            color: "orange",
        }],
        ["SHIPPING", {
            name: "Đang giao hàng",
            color: "blue",
        }],
        ["COMPLETED", {
            name: "Đã giao hàng",
            color: "green",
        }],
        ["PAID", {
            name: "Chờ giao hàng",
            color: "blue",
        }]
    ]);

    const [order, setOrder] = React.useState({});

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/fullOrder/${orderId}`, {
            headers: {
                Authorization: `Bearer ${keycloak?.keycloak?.token}`
            }
        }).then(res => {
            setOrder(prev => ({
                ...prev,
                ...res.data,
            }));
            setIsFetching(false);
        }).catch(err => {
            console.error(err);
        });

        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/payment/get-payment-by-order-id/${orderId}`, {
            headers: {
                Authorization: `Bearer ${keycloak?.keycloak?.token}`
            }
        }).then(res => {
            setOrder(prev => ({
                ...prev,
                payment: res.data,
            }));
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        });
    }, [keycloak?.keycloak?.token, orderId]);

    return (
        (isFetching) ? <CircularProgress /> : (<div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
        }}>
            <div>
                <h3>Chi tiết đơn hàng: {order?.id}</h3>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                }}>
                    <strong>Trạng thái: </strong>
                    {
                        order?.status && (
                            <div style={{
                                backgroundColor: orderStatus.get(order?.status)?.color,
                                color: "#fff",
                                padding: 5,
                                borderRadius: 5,
                            }}>
                                {orderStatus.get(order?.status)?.name}
                            </div>
                        )
                    }
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
            }}>
                <div style={{
                    display: "flex",
                    flex: 6,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 5,
                    justifyContent: "space-between",
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Tên người nhận:&nbsp;</strong>
                        <div>{" " + order?.shippingAddress?.recipientName}</div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Số điện thoại:&nbsp;</strong>
                        <div>{order?.shippingAddress?.recipientPhone}</div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                    ><strong>Địa chỉ giao hàng:&nbsp; </strong>
                        <div> {order?.shippingAddress?.street}, {order?.shippingAddress?.ward}, {order?.shippingAddress?.district}, {order?.shippingAddress?.province}</div>
                    </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 5,

            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 6,
                    gap: 10,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>
                        <strong>Phí:&nbsp;</strong>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Tổng tạm tính:&nbsp;</strong>
                        <div>{formatCurrencyVND(order?.totalPrice)}</div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Phí vận chuyển:&nbsp;</strong>
                        <div>{formatCurrencyVND(0)}</div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Giảm giá:&nbsp;</strong>
                        <div>{formatCurrencyVND(0)}</div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <strong>Tổng tiền:&nbsp;</strong>
                        <div>{formatCurrencyVND(order?.totalPrice)}</div>
                    </div>
                </div>
                <Divider orientation="vertical" flexItem />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    flex: 6,
                    gap: 10,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>
                        <strong>Payment:</strong>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        {
                            order?.payment ? (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <strong>Ngày thanh toán:&nbsp;</strong>
                                    <div>{formatDateTime(order?.payment?.createdDate)}</div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}>
                                        <strong>Phương thức thanh toán:&nbsp;</strong>
                                        <div>{order?.payment?.paymentMethod}</div>
                                    </div>
                                </div>

                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}>
                                    <h3>Chưa thanh toán</h3>
                                </div>
                            )
                        }
                    </div>

                </div>

            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 5,
            }}>
                <h3>Danh sách sản phẩm</h3>
                {/* <OrderItemTable items={
                    order && order?.items || []
                } /> */}
                <OrderItemTable items={ (order && order.items) || [] } />

            </div>
        </div>)
    )
}

export default OrderDetailMain
