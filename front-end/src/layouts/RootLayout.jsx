import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div style={{flex: 1, backgroundColor: "#eff4f8"}}>
      <Outlet />
    </div>
  )
}

export default RootLayout
