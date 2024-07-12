import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddressSelectorModal = ({ open, handleClose, setter, action }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [street, setStreet] = useState('');

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const keycloak = useKeycloak();

  const { enqueueSnackbar } = useSnackbar();
  const handleAddAddress = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('Đã thêm một địa chỉ mới', { variant });
  };

  useEffect(() => {
    if (open) {
      axios.get('https://api.allorigins.win/raw?url=https://vapi.vnappmob.com/api/province')
        .then(response => {
          setProvinces(response.data.results);

        })
        .catch(error => {
          console.error('Error fetching provinces:', error);
        });
    }
  }, [open]);

  const handleProvinceChange = (e) => {

    const provinceId = e.target.value;
    setSelectedProvince(provinceId);

    axios.get(`https://api.allorigins.win/raw?url=https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then(response => {
        setDistricts(response.data.results);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
      })
      .catch(error => {
        console.error('Error fetching districts:', error);
      });
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);

    axios.get(`https://api.allorigins.win/raw?url=https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then(response => {
        setWards(response.data.results);
        setSelectedWard('');
      })
      .catch(error => {
        console.error('Error fetching wards:', error);
      });
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleSubmit = () => {
    const address = {
      userId: keycloak.keycloak.idTokenParsed.sub,
      province: provinces.find(province => province.province_id === selectedProvince).province_name,
      district: districts.find(district => district.district_id === selectedDistrict).district_name,
      ward: wards.find(ward => ward.ward_id === selectedWard).ward_name,
      street: street,
      recipientName,
      recipientPhone,
    }
    axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/add-address`, {
      ...address
    },
      {
        headers: {
          'Authorization': `Bearer ${keycloak.keycloak.token}`
        }
      })
      .then(response => {
        console.log('Address created:', response.data);
        handleAddAddress('success')();
        setter(response.data?.addressList);
      })
      .catch(error => {
        console.error('Error creating address:', error);
      });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>

        <Typography variant="h6" component="h2">
          Thông tin người nhận
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="outlined-adornment-amount">Họ tên</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="outlined-adornment-amount">Số điện thoại</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            onChange={(e) => setRecipientPhone(e.target.value)}
          />
        </FormControl>
        <Typography variant="h6" component="h2">
          Chọn địa chỉ
        </Typography>
        <div style={{ display: "flex", gap: 10 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tỉnh/Thành</InputLabel>
            <Select value={selectedProvince} onChange={handleProvinceChange}>
              <MenuItem value="">
                <em>Chọn Tỉnh/Thành</em>
              </MenuItem>
              {provinces.map(province => (
                <MenuItem key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!selectedProvince}>
            <InputLabel>Quận/Huyện</InputLabel>
            <Select value={selectedDistrict} onChange={handleDistrictChange}>
              <MenuItem value="">
                <em>Chọn Quận/Huyện</em>
              </MenuItem>
              {districts.map(district => (
                <MenuItem key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <FormControl fullWidth margin="normal" disabled={!selectedDistrict}>
            <InputLabel>Phường/Xã</InputLabel>
            <Select value={selectedWard} onChange={handleWardChange}>
              <MenuItem value="">
                <em>Chọn Phường/Xã</em>
              </MenuItem>
              {wards.map(ward => (
                <MenuItem key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-amount">Số nhà, đường</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              onChange={(e) => setStreet(e.target.value)}
            />
          </FormControl>
        </div>

        <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
          Xác nhận
        </Button>
      </Box>
    </Modal>
  );
};

export default AddressSelectorModal;
