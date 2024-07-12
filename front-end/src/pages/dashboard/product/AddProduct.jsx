import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Select } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";

const AddProduct = () => {

  const keycloak = useKeycloak();

  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, message) => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(message, { variant });
  };

  const handleUploadImage = async (event) => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    setIsAddingProduct(true);
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

  const fileTypes = ["JPG", "PNG"];
  const [file, setFile] = useState(null);

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

  const handleAddProduct = async () => {
    // gửi request với token lấy từ cookie

    const uploadImage = await handleUploadImage();

    if (uploadImage !== null) {
      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/products/add`, {
        product: {
          ...product,
          image: uploadImage,
        }
      }, {
        headers: {
          Authorization: `Bearer ${keycloak.keycloak.token}`,
        }
      }).then((res) => {
        console.log(res.data);
        handleClickVariant("success", "Product added successfully!");
        setIsAddingProduct(false);
      }
      ).catch((err) => {
        console.log(err);
        handleClickVariant("error", "Failed to add product!");
      });
    }
  }

  const [product, setProduct] = useState(null);

  const separateAttribute = (category) => {
    switch (category) {
      case "RAM":
        return (
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
                onChange={(e) => {
                  setProduct({
                    ...product,
                    capacity: e.target.value,
                  });
                }
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Speed</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">MHz</InputAdornment>}
                label="Amount"
                onChange={(e) => {
                  setProduct({
                    ...product,
                    speed: e.target.value,
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
                label="Amount"
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
                onChange={(e) => {
                  setProduct({
                    ...product,
                    core: e.target.value,
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
                onChange={(e) => {
                  setProduct({
                    ...product,
                    thread: e.target.value,
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
                startAdornment={<InputAdornment position="start"></InputAdornment>}
                label="Amount"
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
        }}>
          {/* <img src={file ? URL.createObjectURL(file) : ""} alt="product" style={{
            width: "400px",
            height: "350px",
            objectFit: "cover",
          }} />
          <DragDrop /> */}
          <div style={{ height: "350px", display: "flex", alignItems: "center" }}>
            <img src={file ? URL.createObjectURL(file) : ""} alt="product" style={{
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
              label="Amount"
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
              startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
              label="Amount"
              onChange={(e) => {
                setProduct({
                  ...product,
                  price: e.target.value,
                });
              }
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Stock</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Amount"
              onChange={(e) => {
                setProduct({
                  ...product,
                  stock: e.target.value,
                });
              }
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Manufacturer</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Amount"
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
            <Select
              native
              label="Category"
              inputProps={{
                name: 'category',
                id: 'outlined-adornment-amount',
              }}
              onChange={(e) => {
                setProduct({
                  ...product,
                  category: e.target.value,
                });
              }
              }
            >
              <option value={"NONE"}>
                None
              </option>
              <option value={"RAM"}>RAM</option>
              <option value={"CPU"}>CPU</option>
              <option value={"GPU"}>GPU</option>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Description</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Amount"
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
      <Button variant="contained" 
        onClick={() => {
          handleAddProduct();
        }}
        disabled={isAddingProduct}
      >
        Add Product
      </Button>
    </div>
  )
}

export default AddProduct
