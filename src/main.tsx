import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css'

import Layout from './components/Layout.tsx';

import LandingPage from './components/LandingPage.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx'

import MaternalDemographics from './components/Forms/MaternalDemographics.tsx';
import MaternalMedicalHistory from './components/Forms/MaternalMedicalHistory.tsx';
import MaternalPsychiatricHistory from './components/Forms/MaternalPsychiatricHistory.tsx';
import BackPage from './components/BackPage.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/maternal-demographics' element={<BackPage><MaternalDemographics /></BackPage>} />
            <Route path='/maternal-medical-history' element={<BackPage><MaternalMedicalHistory /></BackPage>} />
            <Route path='/maternal-psychiatric-history' element={<BackPage><MaternalPsychiatricHistory /></BackPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
