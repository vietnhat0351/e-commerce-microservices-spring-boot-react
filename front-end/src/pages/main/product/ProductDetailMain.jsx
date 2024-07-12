import { Button, Container } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addProduct } from '../../../redux/slices/cartSlice';
import { useSnackbar } from 'notistack';

const ProductTable = ({ product }) => {

  // không lấy id, image, description, stock
  const { id, image, description, stock, price, category, ...data } = product;
  console.log(data);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {Object.entries(data).map(([key, value], index) => (
          <tr
            key={key}
            style={{
              borderBottom: '1px solid #ddd',
              backgroundColor: index % 2 === 0 ? '#f8fbff' : '#ffffff'
            }}
          >
            <td style={{ padding: '8px', textAlign: "start", width: "20%" }}>{key}</td>
            <td style={{ padding: '8px', textAlign: "start" }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ProductDetailMain = () => {

  const productId = useParams().productId;
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/findById/${productId}`)
      .then(response => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [productId]);

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant) => () => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('Đã thêm một sản phẩm vào giỏ hàng', { variant });
  };

  return (
    <Container style={{
      display: 'flex',
      gap: '20px',
      backgroundColor: '#fff',
    }}>

      <div style={{
        display: 'flex',
        flex: 7,
        flexDirection: 'column',

      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
        }}>
          <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        </div>
        <h3>Thông số kỹ thuật</h3>
        {product && <ProductTable product={product} />}
      </div>
      <div style={{
        flex: 5,
        padding: '20px',
        flexDirection: 'column',
      }}>
        <h3 style={{ textAlign: "start" }}>{product.name}</h3>
        <p style={{ textAlign: "start" }}>Giá: {product.price}</p>
        <p style={{ textAlign: "start" }}>Số lượng tồn: {product.stock}</p>
        <Button variant="contained" color="error"
          onClick={() => {
            dispatch(addProduct({ ...product, quantity: 1 }));
            handleClickVariant('success')();
          }}
        >Thêm vào giỏ hàng</Button>

      </div>
    </Container>
  )
}

export default ProductDetailMain
