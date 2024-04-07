import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css'

import Layout from './components/Layout.tsx';

import LandingPage from './components/LandingPage.tsx'
import Dashboard from './components/ClientDashboard/Dashboard.tsx'

import MaternalDemographics from './components/MaternalDemographics.tsx';
import MaternalMedicalHistory from './components/MaternalMedicalHistory.tsx';
import PsychiatricHistory from './components/PsychiatricHistory.tsx';
import ServicesSubstanceUse from './components/ServicesSubstanceUse.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/maternal-demographics' element={<MaternalDemographics />} />
            <Route path='/maternal-medical-history' element={<MaternalMedicalHistory />} />
            <Route path='/psychiatric-history' element={<PsychiatricHistory />} />
            <Route path='/services-substance-use' element={<ServicesSubstanceUse />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
