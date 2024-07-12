import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Button, Checkbox, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography, alpha } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import React, { useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addProduct, removeProduct } from '../../../redux/slices/cartSlice';
import { formatCurrencyVND } from '../../../utils/Utils';


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
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Sản phẩm',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Đơn giá',
    },
    {
        id: 'stock',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng',
    },
    {
        id: 'thanhTien',
        numeric: false,
        disablePadding: false,
        label: 'Thành tiền',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'center' : 'left'}
                        align={headCell.id === "name" ? 'left' : 'center'}
                        // padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={{ width: headCell.id === 'name' ? 400 : 100 }}
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

function EnhancedTableToolbar(props) {

    const { selected, setRows, rows } = props;
    const numSelected = selected?.length;

    const dispatch = useDispatch();

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Giỏ hàng
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete"
                    onClick={() => {
                        // remove selected products from cart
                        selected.forEach(id => {
                            setRows(rows.filter(row => row.id !== id));
                            dispatch(removeProduct({ id: id }));
                        })
                    }}
                >
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

const Cart = () => {

    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const keycloak = useKeycloak();

    useEffect(() => {

        const requestProductIds = cart.productList.map(product => product.id);

        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/products/allByIdIn`, {
            ids: [...requestProductIds]
        })
            .then(response => {
                // console.log(response.data)
                setRows(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }, [cart])

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

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
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

    const getProductById = (id) => {
        const product = cart.productList.find(product => product.id === id);
        return product;
    }

    const calculateTotal = () => {
        let total = 0;
        cart.productList.forEach(product => {
            total += product?.quantity * rows.find(row => row.id === product.id)?.price;
        });
        return Math.round(total * 100) / 100;
    }

    const calculateTotalQuantity = () => {
        let total = 0;
        cart.productList.forEach(product => {
            total += product?.quantity;
        });
        return total;
    }

    const navigate = useNavigate();


    return (
        (cart.productList.length > 0) ? (<Container style={{ backgroundColor: "#eff4f8", display: "flex", gap: 10 }}>
            <Box sx={{ width: '100%', flex: 9 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar selected={selected} setRows={setRows} rows={rows} />
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
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                    onClick={(event) => handleClick(event, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                onClick={(event) => { navigate(`/products/${row.id}`) }}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <img src={row.image} alt={row.name} style={{ maxWidth: 70, maxHeight: 50 }} />
                                                    <h4>{row.name}</h4>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">{formatCurrencyVND(row.price)}</TableCell>
                                            <TableCell align="center">
                                                <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                                    <Button onClick={() => {
                                                        dispatch(addProduct({ id: row.id, quantity: -1 }))
                                                    }}

                                                        disabled={getProductById(row.id)?.quantity <= 1}
                                                        xs={{ fontSize: 20 }}
                                                    ><FaMinus /></Button>
                                                    {getProductById(row.id)?.quantity}
                                                    <Button onClick={() => {
                                                        dispatch(addProduct({ id: row.id, quantity: 1 }))
                                                    }}><FaPlus /></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">{
                                                formatCurrencyVND(Math.round(row.price * getProductById(row.id)?.quantity * 100) / 100)
                                            }</TableCell>
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
            </Box>
            <div style={{ flex: 3, backgroundColor: "#ffffff", display: "block", flexDirection: "column", borderRadius: 5 }}>
                <h1>Thông tin đơn hàng</h1>
                <h3>Tổng số lượng: {calculateTotalQuantity()}</h3>
                <h3>Tổng tiền: {formatCurrencyVND(calculateTotal())}</h3>
                <Button variant="contained" color="primary" sx={{ width: "90%" }}
                    onClick={() => {
                        keycloak.keycloak.authenticated ? navigate('/checkout') : keycloak.keycloak.login();
                    }}
                >ĐẶT HÀNG NGAY</Button>
            </div>
        </Container>) : (
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
                <Button variant="contained" color="error" onClick={() => navigate('/')}>
                    Mua sắm ngay
                </Button>
            </Container>
        )
    )
}

export default Cart
