import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    Slider
} from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import ProductCards from '../../../components/ProductCards';

const ProductList = (props) => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);
    const [filters, setFilters] = useState({});
    const [priceFilter, setPriceFilter] = useState({});
    const [priceRange, setPriceRange] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/allByCategory?category=${categoryName}`)
            .then(response => {
                // lấy ra tất cả query params
                const queryParams = new URLSearchParams(window.location.search);
                const encodedCriteria = queryParams.get('criteria');

                let cri;

                if (encodedCriteria) {
                    cri = JSON.parse(decodeURIComponent(encodedCriteria));
                    setCriteria(cri);

                    const filteredData = filterData(response.data, cri);
                    setProducts(filteredData);
                }
                else {
                    setProducts(response.data);
                }

                axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/getFilterByCategory?category=${categoryName}`)
                    .then(response => {
                        console.log(response.data);
                        setPriceFilter(response.data.price);
                        const { id, category, price, ...filteredObject } = response.data;
                        setFilters(filteredObject);
                        setPriceRange(cri?.price ? [cri?.price.min, cri?.price.max] : [response.data.price.min, response.data.price.max]);
                    })
                    .catch(error => {
                        console.log(error);
                    })

            })
            .catch(error => {
                console.log(error);
            })

    }

    function filterData(data, criteria) {
        return data.filter(item => {
            return Object.keys(criteria).every(key => {
                if (Array.isArray(criteria[key])) {
                    // return criteria[key].includes(item[key]);
                    // so sánh không phân biệt hoa thường nếu là string
                    return criteria[key].some(value => {
                        if (typeof value === 'string') {
                            return item[key].toLowerCase().includes(value.toLowerCase());
                        }
                        return item[key] === value;
                    });

                } else if (typeof criteria[key] === 'object') {
                    const condition = criteria[key];
                    if (condition.min !== undefined && item[key] < condition.min) return false;
                    if (condition.max !== undefined && item[key] > condition.max) return false;
                    if (condition.contains && !item[key].includes(condition.contains)) return false;
                    // Add more condition checks as needed
                    return true;
                } else {
                    return item[key] === criteria[key];
                }
            });
        });
    }

    const handleCheckboxChange = (event, setter, key) => {
        const { name } = event.target;
        const item = JSON.parse(name);
        setter(prevState => {
            if (prevState[key])
                // console.log("aaaaaaaaaaaaaaaaaaa",prevState[key]);
                return {
                    ...prevState,
                    [key]: prevState[key].includes(item) ? prevState[key].filter(i => i !== item) : [...prevState[key], item]
                };
            return {
                ...prevState,
                [key]: [item]
            };
        });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setCriteria({
            ...criteria,
            price: {
                min: newValue[0],
                max: newValue[1]
            }
        });
    };

    const handleApplyFilter = () => {
        // const queryParams = new URLSearchParams(JSON.stringify(criteria)).toString();
        // navigate(`/category/${categoryName}?${new URLSearchParams((criteria)).toString()}`);

        // const encodedCriteria = encodeURIComponent(JSON.stringify(criteria));
        // window.location.search = `criteria=${encodedCriteria}`;
        const queryParams = new URLSearchParams();
        queryParams.append('criteria', encodeURIComponent(JSON.stringify(criteria)));
        navigate(`?${queryParams.toString()}`);
        fetchData();
    }

    const [criteria, setCriteria] = useState({});

    return (
        <Container style={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#eff4f8",
        }}>
            <div style={{ flex: 3 }}>
                <div>
                    <Box>
                        <Button onClick={() => {
                            handleApplyFilter();
                        }}>Áp dụng bộ lọc</Button>
                        <Button onClick={() => {
                            setCriteria({});
                        }}>Xóa bộ lọc</Button>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                <Typography>Khoảng giá</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <Typography>Giá: {priceRange[0]} đ - {priceRange[1]}đ</Typography>
                                    <Slider
                                        value={[priceRange[0], priceRange[1]]}
                                        onChange={(event, newValue) => { handlePriceRangeChange(event, newValue) }}
                                        valueLabelDisplay="auto"
                                        min={priceFilter?.min ? priceFilter?.min : 0}
                                        max={priceFilter?.max ? priceFilter?.max : 1}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        {Object.keys(filters).map((key, idx) => {
                            if (key === 'price') return null;
                            return (
                                <Accordion defaultExpanded key={idx}>
                                    <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                        <Typography>{key}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormControl component="fieldset" sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}>
                                            {filters[key].map((item, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    control={<Checkbox name={JSON.stringify(item)}
                                                        // set criteria
                                                        onChange={(event) => {
                                                            handleCheckboxChange(event, setCriteria, key)
                                                        }}
                                                        checked={criteria[key] ? criteria[key]?.includes(item) : false}
                                                    />}
                                                    label={item}
                                                    sx={{ width: "47%" }}
                                                />
                                            )
                                            )}
                                        </FormControl>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        }
                        )}
                    </Box>

                </div>
            </div>
            <div style={{ flex: 9 }}>
                <h2>Category: {categoryName}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5 }}>
                    {products.map(product => (
                        <ProductCards key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default ProductList
