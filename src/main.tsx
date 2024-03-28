import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPAge from './components/LandingPage.tsx'
import './index.css'

import Layout from './components/Layout.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<LandingPAge />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
