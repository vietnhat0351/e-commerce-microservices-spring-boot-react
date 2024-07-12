import React, { useEffect } from 'react'
import Sidebar from '../components/navbar/Sidebar'
import { Outlet } from 'react-router-dom'
import { useSnackbar } from 'notistack';

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addMewOrders } from '../redux/slices/newOrdersSlice';

const DashboardLayout = () => {

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, message) => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar(message, { variant });
  };

  const socket = new SockJS(process.env.REACT_APP_API_URL + "/ws");
//  const socket = new SockJS("http://localhost:8083" + "/ws");
  const client = Stomp.over(socket);

  const keycloak = useKeycloak();

  const dispatch = useDispatch();

  useEffect(() => {
    const token = keycloak.keycloak.token;
    // if(token !== undefined) {
    //   try {
    //     client.connect({
    //       Authorization: "Bearer " + token
    //     }, function (frame) {
    //       console.log("Connected: " + frame);
    //       client.subscribe("/topic/new-order", (message) => {
    //         const messageBody = JSON.parse(message.body);
    //         console.log(messageBody);
    //       });
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }

    client.debug = null;
      if(token !== undefined) {
        try {
          client.connect({}, function (frame) {
            console.log("Connected: " + frame);
            client.subscribe("/topic/new-order", (message) => {
              const messageBody = JSON.parse(message.body);
              dispatch(addMewOrders(messageBody));
              handleClickVariant("success", `Một đơn hàng mới id: ${messageBody.orderId} đã được tạo `);
            });
          });
        } catch (error) {
          console.error(error);
        }
    }
  }, [keycloak.keycloak.token]);

  return (
    <div className='container' style={{
      display: "flex", 
      backgroundColor: "#eff4f8"
      }}>
      <div className='sidebar' style={{flex: 2}}>
        <Sidebar />
      </div>
      <div className='content' style={{flex: 10, padding: 10}}>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
