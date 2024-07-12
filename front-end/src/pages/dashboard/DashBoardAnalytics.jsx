import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts';
import styled from 'styled-components';

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

const Pagination = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  border: 1px solid #dddddd;
  background-color: #ffffff;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #dddddd;
`;

const ProductTable = ({ items }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / rowsPerPage);
  const currentItems = items.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Table className="table">
        <thead>
          <tr>
            <Th>Tên sản phẩm</Th>
            <Th>Mã sản phẩm</Th>
            <Th>SL đã bán</Th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product, index) => (
            <tr key={index}>
              <Td>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <img src={product.image} alt={product.name} style={{ width: 70, height: 50 }} />
                  <div>{product.name}</div>
                </div>
              </Td>
              <Td>{product.id}</Td>
              <Td>{product.totalSold}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Footer>
        <div>
          <label htmlFor="rowsPerPage">Rows per page: </label>
          <Select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}>
            {[5, 10, 15, 20].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </Select>
        </div>
        <Pagination>
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </Pagination>
      </Footer>
    </>
  );
};
const DashBoardAnalytics = () => {

  const keycloak = useKeycloak();

  const [productSoldByCategory, setProductSoldByCategory] = React.useState([
    ['Category', 'Sold'],
  ]);

  const [productSold, setProductSold] = React.useState([]);

  const [productSoldByProvince, setProductSoldByProvince] = React.useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/getProductSoldByCategory`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      })
      .then(response => {
        // chuyển object thành mảng 2 chiều
        const data = Object.entries(response.data).map(([key, value]) => [key, value]);
        data.unshift(['Category', 'Sold']);
        setProductSoldByCategory(data);
      })
      .catch(error => {
        console.log(error);
      })

    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/getProductSold`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      })
      .then(response => {
        setProductSold(response.data);
      })
      .catch(error => {
        console.log(error);
      })

    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/get-order-quantity-by-province`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      }).then(response => {

        const data = Object.entries(response.data).map(([key, value]) => [key, value]);
        setProductSoldByProvince(data.sort((a, b) => b[1] - a[1]) || []);

      }).catch(error => {
        console.log(error);
      })


  }, [])

  const options = {
    title: "Thống sản phẩm bán được theo danh mục",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: 20,
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
      }}>
        <div style={{
          borderRadius: 20,
          backgroundColor: "#fff",
          overflow: "hidden",

        }}>
          <Chart
            chartType="PieChart"
            data={productSoldByCategory}
            options={options}
            width={"600px"}
            height={"500px"}
          />
        </div>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 10,
        }}>
          <h3>Top Khu Vực Mua Hàng Nhiều Nhất</h3>
          <Table>
            <thead>
              <tr>
                <Th>Số Thứ Tự</Th>
                <Th>Tỉnh thành</Th>
                <Th>Số lượng Sản Phẩm</Th>
              </tr>
            </thead>
            <tbody>
              {productSoldByProvince.map((item, index) => (
                <tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{item[0]}</Td>
                  <Td>{item[1]}</Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <TfootTd>Tổng</TfootTd>
                <TfootTd>{productSoldByProvince.reduce((total, item) => total + item[1], 0)}</TfootTd>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
      <h3>Sản phẩm bán chạy</h3>
      {productSold.length > 0 && <ProductTable items={
        productSold.sort((a, b) => b.totalSold - a.totalSold)
      } />}
    </div>
  )
}

export default DashBoardAnalytics
