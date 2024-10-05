import React from 'react';
import { useUser } from './auth';
import NavBar from './components/NavBar';
import './fonts.css';
import './Root.css'; // You may need to create this file for additional styles
import { Outlet } from 'react-router-dom'

export default function Dashboard() {
  const user = useUser();

  return (
    <>
      <NavBar />
      <main className='flex-shrink-0'>
        <div className='container'>
          <Outlet />
        </div>
      </main>

    </>
  );
}