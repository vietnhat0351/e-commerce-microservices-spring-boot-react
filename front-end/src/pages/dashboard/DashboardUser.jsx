import React from 'react'
import { Outlet } from 'react-router-dom';

const DashboardUser = () => {
  return (
    <div> 
        <h1>Dashboard User</h1>
        <Outlet />
    </div>
  )
}

export default DashboardUser;
