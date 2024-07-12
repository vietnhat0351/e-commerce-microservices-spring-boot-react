import { Button, CircularProgress, Container } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useDispatch } from 'react-redux';
import { removeAllProducts } from '../../../../redux/slices/cartSlice';
import { formatCurrencyVND, formatDateTime, formatOrderId } from '../../../../utils/Utils';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Mã đơn hàng',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Ngày mua',
  },
  {
    id: 'items',
    numeric: true,
    disablePadding: false,
    label: 'Sản phẩm',
  },
  {
    id: 'totalPrice',
    numeric: false,
    disablePadding: false,
    label: 'Tổng tiền',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'center' : 'left'}
            align={headCell.id === "name" ? 'left' : 'center'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.id === 'items' ? 400 : 150 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Order = () => {

  const keycloak = useKeycloak();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const [orders, setOrders] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState(queryParams.get('status') ? queryParams.get('status') : 'ALL');

  const [loading, setLoading] = React.useState(true);

  const filterData = (order, status) => {
    if (status.status === 'ALL') {
      return order;
    }
    return order.filter(order => {
      return order.status === status.status?.toUpperCase();
    });
  }

  useEffect(() => {
    const userId = keycloak?.keycloak?.subject;
    userId && axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders/fullOrdersByUserId?userId=` + userId, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    })
      .then(response => {
        const filteredData = filterData(response.data, { status: selectedStatus });
        setOrders(filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setRows(filteredData);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
    
  }, [selectedStatus, keycloak?.keycloak?.subject]);

  const dispatch = useDispatch();
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getAllProductNameInOrder = (items) => {
    let productNames = "";
    items.map(item => {
      productNames += item?.product?.name + ", ";
    });
    return productNames;
  }

  const handlePaymet = (id) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/payment/momo-pay`, {
      orderId: id,
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
  }

  const RenderTableBody = () => {
    return (
      <div>
        {orders.length > 0 ? (<Box sx={{ width: '100%', flex: 9 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            {/* <EnhancedTableToolbar selected={selected} setRows={setRows} rows={rows} /> */}
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          onClick={(event) => { navigate(`/account/orders/${row.id}`) }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "blue" }}>
                            {formatOrderId(row?.id)}
                          </div>
                        </TableCell>
                        <TableCell align="center">{formatDateTime(row?.createdAt)}</TableCell>
                        <TableCell align="center">
                          <div style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                          >
                            {getAllProductNameInOrder(row?.items)}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {formatCurrencyVND(row?.totalPrice)}
                        </TableCell>
                        <TableCell align="center">
                          {row?.status === 'PENDING' ? "Chờ thanh toán" : row?.status === "PAID" ? "Chờ giao hàng" : row?.status === 'SHIPPING' ? 'Đang giao hàng' : row?.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                          {row?.status === 'PENDING' ?
                            <Button variant="outlined" color="primary"
                              sx={{
                                fontSize: 10,
                              }}
                              onClick={() => {
                                setIsPaymentLoading(true);
                                handlePaymet(row.id);
                              }}
                            >{isPaymentLoading ? "Loading..." : "Thanh toán" }</Button> : ''}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, { label: 'All', value: -1 }]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>) : (
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
              backgroundImage: `url(	https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/5fafbb923393b712b964.png)`,
              backgroundSize: "cover",
              width: 200,
              height: 200,
              backgroundRepeat: "no-repeat",
            }}></div>
            <div>
              <h3>Chưa có đơn hàng nào</h3>
            </div>
            <Button variant="contained" color="error" onClick={() => navigate('/')}>
              Mua sắm ngay
            </Button>
          </Container>
        )
        }
      </div >
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        borderRadius: 5,
      }}>
        <Button sx={{
          backgroundColor: selectedStatus === 'ALL' ? '#f50057' : '',
          color: selectedStatus === 'ALL' ? '#fff' : '',
          ":hover": {
            backgroundColor: selectedStatus === 'ALL' ? '#f50057' : '',
            color: selectedStatus === 'ALL' ? '#fff' : '',
          }
        }} onClick={() => {
          setLoading(true);
          setSelectedStatus('ALL');
          navigate('/account/orders?status=ALL');
        }}>Tất cả</Button>
        <Button sx={{
          backgroundColor: selectedStatus === 'PENDING' ? '#f50057' : '',
          color: selectedStatus === 'PENDING' ? '#fff' : '',
          ":hover": {
            backgroundColor: selectedStatus === 'PENDING' ? '#f50057' : '',
            color: selectedStatus === 'PENDING' ? '#fff' : '',
          }
        }} onClick={() => {
          setLoading(true);
          setSelectedStatus('PENDING');
          navigate('/account/orders?status=PENDING');
        }}>chờ thanh toán</Button>
        <Button sx={{
          backgroundColor: selectedStatus === 'SHIPPING' ? '#f50057' : '',
          color: selectedStatus === 'SHIPPING' ? '#fff' : '',
          ":hover": {
            backgroundColor: selectedStatus === 'SHIPPING' ? '#f50057' : '',
            color: selectedStatus === 'SHIPPING' ? '#fff' : '',
          }
        }} onClick={() => {
          setLoading(true);
          setSelectedStatus('SHIPPING');
          navigate('/account/orders?status=SHIPPING');
        }}>chờ giao hàng</Button>
        <Button sx={{
          backgroundColor: selectedStatus === 'COMPLETED' ? '#f50057' : '',
          color: selectedStatus === 'COMPLETED' ? '#fff' : '',
          ":hover": {
            backgroundColor: selectedStatus === 'COMPLETED' ? '#f50057' : '',
            color: selectedStatus === 'COMPLETED' ? '#fff' : '',
          }
        }} onClick={() => {
          setLoading(true);
          setSelectedStatus('COMPLETED');
          navigate('/account/orders?status=COMPLETED');
        }}>Hoàn thành</Button>
        <Button sx={{
          backgroundColor: selectedStatus === 'CANCELLED' ? '#f50057' : '',
          color: selectedStatus === 'CANCELLED' ? '#fff' : '',
          ":hover": {
            backgroundColor: selectedStatus === 'CANCELLED' ? '#f50057' : '',
            color: selectedStatus === 'CANCELLED' ? '#fff' : '',
          }
        }} onClick={() => {
          setLoading(true);
          setSelectedStatus('CANCELLED');
          navigate('/account/orders?status=CANCELLED');
        }}>Đã hủy</Button>

      </div>
      <div>
        {loading ? <CircularProgress /> : <RenderTableBody />}
      </div>
    </div>
  )
}

export default Order
