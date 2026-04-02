import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const { isOwner, navigate, userLoading } = useAppContext()

  useEffect(() => {
    if (userLoading) return

    if (!isOwner) {
      navigate('/')
    }

  }, [userLoading, isOwner])

  if (userLoading) {
    return <div className='p-10 text-center'>Loading...</div>
  }

  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout