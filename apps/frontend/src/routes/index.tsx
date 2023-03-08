import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PriceComponent from '../pages/Price';
import PrivateRoutes from './private';
import SignIn from '../pages/Signin';

export const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<PriceComponent />} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/private" element={<PrivateRoutes />}>
        <Route path="" element={<>Private</>} />
      </Route>
    </Routes>
  )
}