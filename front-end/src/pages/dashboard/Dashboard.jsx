import { useKeycloak } from '@react-keycloak/web'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { formatCurrencyVND, formatDateTime } from '../../utils/Utils'
import styled from 'styled-components';
import MyEnhancedTable from '../../components/EnhancedTable';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
`;

const orderTableHeadCells = [
  {
    id: 'stt',
    numeric: false,
    disablePadding: true,
    label: 'STT',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Order Id',
  },
  {
    id: 'productQuantity',
    numeric: false,
    disablePadding: false,
    label: 'SLSP',
  },
  {
    id: 'totalPrice',
    numeric: true,
    disablePadding: false,
    label: 'Tổng Tiền',
  },
  {
    id: 'orderDate',
    numeric: true,
    disablePadding: false,
    label: 'Ngày Đặt Hàng',
  },
];

const ProductTableHeadCells = [
  {
    id: 'stt',
    numeric: false,
    disablePadding: true,
    label: 'STT',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Tên Sản Phẩm',
  },
  {
    id: 'stock',
    numeric: false,
    disablePadding: false,
    label: 'SL Còn Lại',
  },
];

const Dashboard = () => {

  const [totalOrders, setTotalOrders] = useState(0)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  const keycloak = useKeycloak();

  const [paidOrders, setPaidOrders] = useState([]);
  const [productStockUnder, setProductStockUnder] = useState([]);

  const newOrders = useSelector((state) => state.newOrders.newOrders);

  useEffect(() => {
    if(newOrders && newOrders.length > 0) {
      let data = []
      console.log(newOrders)
      // newOrders.sort((a, b) => a.createdAt - b.createdAt)
      newOrders.map((order, index) => {


        // bỏ field product, shippingAddress ra khỏi order
        const filteredOrder = (({ product, shippingAddress, items, customerId, paymentMethod, status, ...o }) => o)(order);
        // thêm số thứ tự vào order
        filteredOrder.stt = index + 1;
        // thêm số lượng sản phẩm vào order
        filteredOrder.productQuantity = order?.items?.length;
        // xắp xếp lại thứ tự các field filteredOrder theo thứ tự: Số Thứ Tự, Mã Đơn Hàng, Số lượng sản phẩm, Ngày Đặt Hàng,	Tổng Tiền

        const orderFields = {
          stt: filteredOrder.stt,
          id: filteredOrder.id,
          productQuantity: filteredOrder.productQuantity,
          totalPrice: formatCurrencyVND(filteredOrder.totalPrice),
          createdAt: formatDateTime(filteredOrder.createdAt),
        };

        const row = Object.entries(orderFields).map(([key, value]) => [key, value]);
        data = [...data, {
          id: order.id,
          row: row
        }];
      })
      setPaidOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    
  }, [newOrders]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/get-total-quantity`, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    })
      .then(res => {
        setTotalOrders(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/get-total-quantity`, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    })
      .then(res => {
        setTotalCustomers(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/get-total-quantity`, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    })
      .then(res => {
        setTotalProducts(res.data)
      })
      .catch(err => {
        console.error(err)
      })

    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/get-total-order-amount-today`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      }).then(response => {

        setTotalRevenue(response.data);
      }).catch(error => {
        console.error(error);
      })

    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/get-paid-orders`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      }).then(response => {
        let data = []
        response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => {


          // bỏ field product, shippingAddress ra khỏi order
          const filteredOrder = (({ product, shippingAddress, items, customerId, paymentMethod, status, ...o }) => o)(order);
          // thêm số thứ tự vào order
          filteredOrder.stt = index + 1;
          // thêm số lượng sản phẩm vào order
          filteredOrder.productQuantity = order?.items?.length;
          // xắp xếp lại thứ tự các field filteredOrder theo thứ tự: Số Thứ Tự, Mã Đơn Hàng, Số lượng sản phẩm, Ngày Đặt Hàng,	Tổng Tiền

          const orderFields = {
            stt: filteredOrder.stt,
            id: filteredOrder.id,
            productQuantity: filteredOrder.productQuantity,
            totalPrice: formatCurrencyVND(filteredOrder.totalPrice),
            createdAt: formatDateTime(filteredOrder.createdAt),
          };

          const row = Object.entries(orderFields).map(([key, value]) => [key, value]);
          data = [...data, {
            id: order.id,
            row: row
          }];
        })
        setPaidOrders(data);
      }).catch(error => {
        console.error(error);
      })

    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/get-product-by-stock-under?stockUnder=20`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      }).then(response => {
        let data = []

        response.data.sort((a, b) => a.stock - b.stock).map((product, index) => {

          const filteredproduct = (({ description, price, category, image, manufacturer, ...o }) => o)(product);

          filteredproduct.stt = index + 1;

          const productFields = {
            stt: filteredproduct.stt,
            name: filteredproduct.name,
            stock: filteredproduct.stock,
          };

          const row = Object.entries(productFields).map(([key, value]) => [key, value]);
          data = [...data, {
            id: product.id,
            row: row
          }];

        })
        setProductStockUnder(data);
      }).catch(error => {
        console.error(error);
      })

  }, [keycloak?.keycloak?.token])

  const navigate = useNavigate();

  const handleOnclickProductTableRow = (rowId) => {
    navigate(`/dashboard/products/${rowId}`)
  }

  const handleOnclickOrderTableRow = (rowId) => {
    navigate(`/dashboard/orders/${rowId}`)
  }


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-around",
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
        }}>
          <h3>Tổng Số Đơn Hàng</h3>
          <p>{totalOrders}</p>
        </div >

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
        }}>
          <h3>Tổng Khách Hàng</h3>
          <p>{totalCustomers}</p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
        }}>
          <h3>Tổng Số Sản Phẩm</h3>
          <p>{totalProducts}</p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 10,
        }}>
          <h3>Tổng Doanh Thu Ngày</h3>
          <p>{formatCurrencyVND(totalRevenue)}</p>
        </div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 20,
      }}>
        <div style={{
          display: "flex",
          width: "50%",
          flex: 6
        }}>
          {paidOrders && <MyEnhancedTable
            headCells={orderTableHeadCells}
            data={paidOrders}
            tableHeader={"Danh Sách Đơn Hàng Cần Xử Lý"}
            handleClickRow={handleOnclickOrderTableRow} />}
        </div>
        <div style={{
          display: "flex",
          width: "50%",
          flex: 6
        }}>
          {productStockUnder && <MyEnhancedTable
            headCells={ProductTableHeadCells}
            data={productStockUnder}
            tableHeader={"Danh Sách Sản Phẩm Sắp Hết Hàng"}
            handleClickRow={handleOnclickProductTableRow}/>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
