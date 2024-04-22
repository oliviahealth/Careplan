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
import PsychiatricHistory from './components/Forms/PsychiatricHistory.tsx';
import InfantInformation from './components/Forms/InfantInformation.tsx';
import SubstanceUseHistory from './components/Forms/SubstanceUseHistory.tsx';
import MedicalServicesForSubstanceUse from './components/Forms/MedicalServicesForSubstanceUse.tsx';
import FamilyAndSupports from './components/Forms/FamilyAndSupports.tsx';
import DrugScreeningResults from './components/Forms/DrugScreeningResults.tsx';

import useAppStore from './store/useAppStore.ts'; 

const userId = 'd2bd4688-5527-4bbb-b1a8-af1399d00b12'; 
const user = { id: userId, name: 'Vedarth Atreya', username: 'vedarth31' };
useAppStore.setState({ user });

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
            <Route path='/medical-services-for-substance-use' element={<MedicalServicesForSubstanceUse />} />
            <Route path='/substance-use-history' element={<SubstanceUseHistory />} />
            <Route path='/drug-screening-results' element={<DrugScreeningResults />} />
            <Route path='/family-and-supports' element={<FamilyAndSupports />} />
            <Route path='/infant-information' element={<InfantInformation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
