import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css'

import Layout from './components/Layout.tsx';

import BackPage from './components/BackPage.tsx';
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
import ReferralsAndServices from './components/Forms/ReferralsAndServices.tsx';
import RelapsePreventionPlan from './components/Forms/RelapsePreventionPlan.tsx';

import useAppStore from './store/useAppStore.ts'; 

// const userId = '68ff7667-570d-4d2e-9ff4-91706912472a';
const userId = '4e28b0dd-4923-4b0b-9ed5-76ad79fca1e3'; 
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
            <Route path='/maternal-demographics/:submissionId?' element={<BackPage><MaternalDemographics /></BackPage>} />
            <Route path='/maternal-medical-history/:submissionId?' element={<BackPage><MaternalMedicalHistory /></BackPage>} />
            <Route path='/psychiatric-history/:submissionId?' element={<BackPage><PsychiatricHistory /></BackPage>} />
            <Route path='/medical-services-for-substance-use/:submissionId?' element={<BackPage><MedicalServicesForSubstanceUse /></BackPage>} />
            <Route path='/substance-use-history/:submissionId?' element={<BackPage><SubstanceUseHistory /></BackPage>} />
            <Route path='/drug-screening-results/:submissionId?' element={<BackPage><DrugScreeningResults /></BackPage>} />
            <Route path='/family-and-supports/:submissionId?' element={<BackPage><FamilyAndSupports /></BackPage>} />
            <Route path='/infant-information/:submissionId?' element={<BackPage><InfantInformation /></BackPage>} />
            <Route path='/referrals-and-services/:submissionId?' element={<BackPage><ReferralsAndServices /></BackPage>} />
            <Route path='/relapse-prevention-plan/:submissionId?' element={<BackPage><RelapsePreventionPlan /></BackPage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
