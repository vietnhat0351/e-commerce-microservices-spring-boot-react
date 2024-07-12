import { CircularProgress, Container } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductCards from '../../components/ProductCards';

const HomePage = () => {

  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/all`)
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }, []);

  return (
    <Container>
      {isLoading ? <CircularProgress /> : (<div style={{ flex: 1, paddingTop: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5 }}>
          {products.map(product => (
            <ProductCards key={product.id} product={product} />
          ))}
        </div>
      </div>)}
    </Container>
  )
}

export default HomePage
