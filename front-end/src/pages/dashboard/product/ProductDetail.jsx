import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Select } from '@mui/material'
import React, { useEffect } from 'react'
import { FileUploader } from "react-drag-drop-files";
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const ProductDetail = () => {

    const keycloak = useKeycloak();

    const [file, setFile] = useState(null);
    const fileTypes = ["JPG", "PNG"];
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [originalProductString, setOriginalProductString] = useState("");

    const [isProductChanged, setIsProductChanged] = useState(false);

    useEffect(() => {
        setIsProductChanged(originalProductString.localeCompare(JSON.stringify(product)) !== 0);
    }, [product]);

    const DragDrop = () => {

        const handleChange = (file) => {
            setFile(file);
        };
        return (
            <div style={{ width: 400 }}>
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
            </div>

        );
    }
    const handleUploadImage = async (event) => {
        // event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/storage/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${keycloak.keycloak.token}`,
                }
            });
            setProduct({
                ...product,
                image: response.data
            });
            console.log("File uploaded successfully!", response.data);
            return response.data;
        } catch (error) {
            console.error("There was an error uploading the file!", error);
            return null;
        }
    };

    const handleUpdateProduct = async () => {

        let uploadImage = null;
        if (file !== null) {
            uploadImage = await handleUploadImage();
        }

        axios.put(`${process.env.REACT_APP_API_URL}/api/v1/products/update`, {
            product: {
                ...product,
                image: uploadImage ? uploadImage : product.image,
            }
        }, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`,
            }
        }).then((res) => {
            console.log(res.data);
        }
        ).catch((err) => {
            console.log(err);
        });

    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/findById/${id}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data);
                setOriginalProductString(JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    const separateAttribute = (category) => {
        switch (category) {
            case "RAM":
                return (
                    // capacity, speed, latency, memory type
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        paddingRight: "20px",
                    }}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Capacity</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">GB</InputAdornment>}
                                label="Amount"
                                value={product?.capacity ? product.capacity : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        capacity: parseInt(e.target.value),
                                    });
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Speed</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">MHz</InputAdornment>}
                                label="Amount"
                                value={product?.speed ? product.speed : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        speed: parseInt(e.target.value),
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Latency</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                label="Amount"
                                value={product?.latency ? product.latency : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        latency: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Memory Type</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                                value={product?.memoryType ? product.memoryType : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        memoryType: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                    </div>
                )
            case "CPU":
                return (
                    // core, thread, base clock, boost clock, tdp, cache, socket, series
                    // hiển thị các input tương ứng. bố cục 2 cột
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        paddingRight: "20px",
                    }}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Core</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                label="Amount"
                                value={product?.core ? product.core : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        core: parseInt(e.target.value),
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Thread</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                label="Amount"
                                value={product?.thread ? product.thread : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        thread: parseInt(e.target.value),
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Base Clock</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">GHz</InputAdornment>}
                                label="Amount"
                                value={product?.baseClock ? product.baseClock : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        baseClock: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Boost Clock</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">GHz</InputAdornment>}
                                label="Amount"
                                value={product?.boostClock ? product.boostClock : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        boostClock: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">TDP</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                label="Amount"
                                value={product?.tdp ? product.tdp : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        tdp: e.target.value,
                                    });
                                }
                                }

                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Cache</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">MB</InputAdornment>}
                                label="Amount"
                                value={product?.cache ? product.cache : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        cache: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Socket</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                label="Amount"
                                value={product?.socket ? product.socket : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        socket: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Series</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"></InputAdornment>}
                                label="Amount"
                                value={product?.series ? product.series : ""}
                                onChange={(e) => {
                                    setProduct({
                                        ...product,
                                        series: e.target.value,
                                    });
                                }
                                }
                            />
                        </FormControl>
                    </div>
                )
                case "GPU":
                    return (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        paddingRight: "20px",
                      }}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-amount">Graphics Processing Unit</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            label="Amount"
                            value={product?.graphicsProcessingUnit ? product.graphicsProcessingUnit : ""}
                            onChange={(e) => {
                              setProduct({
                                ...product,
                                graphicsProcessingUnit: e.target.value,
                              });
                            }
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-amount">Memory</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">GB</InputAdornment>}
                            label="Amount"
                            value={product?.memory ? product.memory : ""}
                            onChange={(e) => {
                              setProduct({
                                ...product,
                                memory: e.target.value,
                              });
                            }
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-amount">Memory Type</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            label="Amount"
                            value={product?.memoryType ? product.memoryType : ""}
                            onChange={(e) => {
                              setProduct({
                                ...product,
                                memoryType: e.target.value,
                              });
                            }
                            }
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-amount">Brand</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            label="Amount"
                            value={product?.brand ? product.brand : ""}
                            onChange={(e) => {
                              setProduct({
                                ...product,
                                brand: e.target.value,
                              });
                            }
                            }
                          />
                        </FormControl>
                        </div>
                    )
            default:
                return null;
        }
    }

    return (
        <div>
            <h1>Add Product</h1>
            <div style={{
                display: "flex",
                gap: "10px",
            }}>
                <div style={{
                    gap: "10px",
                    backgroundColor: "#ffffff",
                    flex: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "5px",
                    borderRadius: "10px",
                    justifyContent: "center",
                }}>
                    <div style={{height: "350px", display: "flex", alignItems: "center"}}>
                        <img src={file ? URL.createObjectURL(file) : product.image} alt="product" style={{
                            maxWidth: "400px",
                            maxHeight: "350px",
                            objectFit: "cover",
                        }} />
                    </div>
                    <div>
                        <DragDrop />
                    </div>
                </div>
                <div style={{
                    flex: 8,
                    flexDirection: "column",
                    display: "flex",
                    paddingRight: "20px",
                }}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            value={product?.name ? product.name : ""}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    name: e.target.value,
                                });
                            }
                            }
                        />

                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Amount"
                            value={product?.price ? product.price : ""}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    price: parseFloat(e.target.value),
                                });
                            }
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Stock</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            value={product?.stock ? product.stock : ""}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    stock: parseInt(e.target.value),
                                });
                            }
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Manufacturer</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            value={product?.manufacturer ? product.manufacturer : ""}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    manufacturer: e.target.value,
                                });
                            }
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Category</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            value={product?.category ? product.category : ""}
                            disabled={true}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    category: e.target.value,
                                });
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Description</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                            label="Amount"
                            value={product?.description ? product.description : ""}
                            onChange={(e) => {
                                setProduct({
                                    ...product,
                                    description: e.target.value,
                                });
                            }
                            }
                        />
                    </FormControl>
                </div>

            </div>
            {separateAttribute(product?.category)}
            <Button variant="contained" style={{
                color: "#fff",
                width: "200px",
                alignSelf: "flex-end",
            }}
                onClick={() => {
                    // handleAddProduct();
                    // kiểm tra xem product có thay đổi so với originalProductString không

                    if (JSON.stringify(product) !== originalProductString || file !== null) {
                        console.log("Product has changed");
                        handleUpdateProduct()
                    }
                }}
                disabled={!isProductChanged}
                color="success"
            >
                Update Product
            </Button>
        </div>
    )
}

export default ProductDetail
