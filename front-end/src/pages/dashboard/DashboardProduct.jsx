import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EnhancedTable from './product/ProductList';


const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Name',
        width: 300,
        editable: false,
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 150,
        editable: false,
    },
    {
        field: 'stock',
        headerName: 'Stock',
        type: 'number',
        width: 110,
        editable: false,
    },
    {
        field: 'category',
        headerName: 'Category',
        //   description: 'This column has a value getter and is not sortable.',
        //   sortable: false,
        width: 160,
        // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
];


const DashboardProduct = () => {

    const [rows, setRows] = React.useState([]);


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/all`)
            .then(response => {
                console.log(response.data);
                setRows(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>Dashboard Product</h1>
            <div>
                <Button variant="contained" color="success"
                    onClick={() => navigate('/dashboard/products/add')}
                >
                    Add Product
                </Button>
            </div>
            <EnhancedTable />
            {/* <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    rowHeight={100}
                    
                
                    onRowDoubleClick={(row) => {
                        console.log(row);

                    }}
                    // isCellEditable={(params) => {
                    //     return false;
                    // }}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box> */}
        </div>
    )
}

export default DashboardProduct
