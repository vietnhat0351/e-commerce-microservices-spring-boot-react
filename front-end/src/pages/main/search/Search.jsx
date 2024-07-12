import { CircularProgress, Container } from '@mui/material'
import React, { useEffect } from 'react'
import ProductCards from '../../../components/ProductCards';
import axios from 'axios';

const Search = () => {
    const query = new URLSearchParams(window.location.search);
    const [products, setProducts] = React.useState([]);

    const [isSearching, setIsSearching] = React.useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/search`, {
            params: {
                query: query.get("query")
            }
        })
            .then(response => {
                setProducts(response.data);
                setIsSearching(false);
            })
            .catch(error => {
                console.log(error);
                setIsSearching(false);
            })
    }, []);

    return (
        <Container>
            {isSearching ? <CircularProgress /> : (
                products.length === 0 ? <h1>Không tìm thấy sản phẩm nào!</h1> : (
                    <div style={{ flex: 1, paddingTop: 20 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5 }}>
                            {products.map(product => (
                                <ProductCards key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )
            )
            }
        </Container>
    )
}

export default Search
