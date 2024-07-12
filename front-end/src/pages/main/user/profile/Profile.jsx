import React, { useEffect, useState } from 'react'

// import './UserInfoForm.css';
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Label } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Profile = () => {

  const keycloak = useKeycloak();
  const [userProfile, setUserProfile] = useState({});

  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [originalProfileString, setOriginalProfileString] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, message) => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(message, { variant });
  };

  useEffect(() => {
    setIsProfileChanged(originalProfileString.localeCompare(JSON.stringify(userProfile)) !== 0);
}, [userProfile]);

  useEffect(() => {
    const userId = keycloak?.keycloak?.subject;
    userId && axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/get-user-profile/` + userId, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    }).then(res => {
      console.log(res.data);
      setUserProfile(res.data);
      setOriginalProfileString(JSON.stringify(res.data));
    }).catch(err => {
      console.error(err);
    });
  }, [keycloak?.keycloak?.subject]);

  const handleBirthDateChange = (value) => {
    setUserProfile({
      ...userProfile,
      dob: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = keycloak?.keycloak?.subject;

    axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-user-profile`, {
      ...userProfile,
      userId: userId
    }, {
      headers: {
        Authorization: `Bearer ${keycloak?.keycloak?.token}`
      }
    }).then(res => {
      console.log(res.data);
      handleClickVariant('success', 'Cập nhật thông tin thành công!');
    }).catch(err => {
      console.error(err);
      handleClickVariant('error', 'Cập nhật thông tin thất bại!');
    });
  };

  const handleChangeGender = (event) => {
    setUserProfile({
      ...userProfile,
      gender: event.target.value
    });
  };

  return (

    <div style={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
    }}>
      <h2>Thông Tin Cá Nhân</h2>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        <div style={styles.formGroup}>
          <div style={styles.labelInput}>
            <p>Họ Tên: </p>
          </div>
          <div style={styles.input}>
            <TextField id="outlined-basic" variant="outlined" style={{ width: "70%" }} 
              value={userProfile?.firstname ? (userProfile?.firstname + ' ' + userProfile?.lastname) : " "}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <div style={styles.labelInput}>
            <p>Ngày Sinh: </p>
          </div>

          <div style={styles.input}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  // label="Controlled picker"
                  // nếu không có value thì mặc định sẽ hiển thị ngày hiện tại
                  value={userProfile?.dob ? dayjs(userProfile?.dob) : dayjs()}
                  onChange={(newValue) => handleBirthDateChange(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div style={styles.formGroup}>
          <div style={styles.labelInput}>
            <p>Giới Tính: </p>
          </div>
          <div style={styles.input}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={userProfile?.gender ? userProfile?.gender : null}
              onChange={handleChangeGender}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
              }}
            >
              <FormControlLabel value="FEMALE" control={<Radio />} label="Nữ" />
              <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
            </RadioGroup>
          </div>
        </div>

        <div style={styles.formGroup}>
          <div style={styles.labelInput}>
            <p>Số điện thoại: </p>
          </div>
          <div style={styles.input}>
            <TextField id="outlined-basic" variant="outlined" style={{ width: "70%" }}
              onChange={(e) => {
                setUserProfile({
                  ...userProfile,
                  phone: e.target.value
                });
              }}
              value={userProfile?.phone ? userProfile?.phone : ""}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <div style={styles.labelInput}>
            <p>Email: </p>
          </div>
          <div style={styles.input}>
            <TextField id="outlined-basic" variant="outlined" style={{ width: "70%" }} 
              value={userProfile?.email ? userProfile?.email : ""} disabled
            />
          </div>
        </div>

        <div>
          <Button variant="contained" onClick={handleSubmit} sx={{ width: "20%" }}
            disabled={!isProfileChanged}
          >Lưu</Button>
        </div>
      </div>

    </div >
  );
}

const styles = {
  formGroup: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  labelInput: {
    display: "flex",
    flex: 3,
    justifyContent: "flex-end",
  },
  input: {
    display: "flex",
    flex: 7,
  },
};

export default Profile
