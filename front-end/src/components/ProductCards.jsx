import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/cartSlice";
import { useSnackbar } from "notistack";
import { Button, Card } from "@mui/material";
import { NavLink } from "react-router-dom";
import { formatCurrencyVND } from "../utils/Utils";

const ProductCards = (props) => {
    const { product } = props;
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (variant) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar('Đã thêm một sản phẩm vào giỏ hàng', { variant });
    };

    return (
        <Card sx={{ maxWidth: 200, display: "flex", height: 230 }} >
            <div
                style={{
                    display: "flex", flexDirection: "column", gap: 5, flex: 1, 
                }}
            >
                <NavLink
                    to={`/products/${product.id}`}
                    style={{
                        objectFit: "cover",
                        flex: 10,
                        display: "flex",
                        flexDirection: "column",
                        textDecoration: "none",
                        color: "black",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        overflow: "hidden",
                    }}
                >
                    <div style={{
                        flex: 10, display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}>

                        <img src={product?.image} alt={product?.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <div style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontSize: 12,
                            fontWeight: "bold",
                        }}
                        >
                            {product?.name}
                        </div>
                    </div>
                </NavLink>
                <div style={{ flex: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }}>
                        <div style={{ fontSize: 12, fontWeight: "bold", color: "blue" }}>
                            {formatCurrencyVND(product?.price)}
                        </div>
                        <Button size="small"
                            onClick={() => {
                                dispatch(addProduct({
                                    id: product.id,
                                    quantity: 1
                                }));
                                handleClickVariant('success')();
                            }}
                        >Thêm vào giỏ</Button>
                    </div>
                </div>
            </div>
        </Card >

    )
}

export default ProductCards;
