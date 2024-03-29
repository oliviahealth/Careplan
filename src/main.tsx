import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import Layout from './components/Layout.tsx';

import LandingPage from './components/LandingPage.tsx'
import Dashboard from './components/ClientDashboard/Dashboard.tsx'

import MaternalDemographics from './components/MaternalDemographics.tsx';
import MaternalMedicalHistory from './components/MaternalMedicalHistory.tsx';
import MaternalPsychiatricHistory from './components/MaternalPsychiatricHistory.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/maternal-demographics' element={<MaternalDemographics />} />
          <Route path='/maternal-medical-history' element={<MaternalMedicalHistory />} />
          <Route path='/maternal-psychiatric-history' element={<MaternalPsychiatricHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
</React.StrictMode>
)
