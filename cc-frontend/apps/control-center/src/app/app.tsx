import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import styled from '@emotion/styled';

import { AuthContext, AuthProvider } from '../context/AuthContext';
import MiniDrawer from '../layout/MiniDrawer';
import { Main } from '../layout/MiniDrawer';
import { AddHosts } from '../pages /AddHosts';
import { LoginPage } from '../pages /Auth_LoginPage';
import { ProtectedPage } from '../pages /Auth_ProtectedPage';
import { Register } from '../pages /Auth_RegisterPage';
import { BackUp } from '../pages /Backup';
import { ContainersInstances } from '../pages /Containers';
import { ContainersInfoLanding } from '../pages /ContainersViewLanding';
import { Home } from '../pages /Home';
import { Hosts } from '../pages /Hosts';
import { HostsEditLanding } from '../pages /HostsEditLanding';
import { HostsInfoLanding } from '../pages /HostsViewLanding';
import { Monitor } from '../pages /Monitor';
import { Services } from '../pages /Services';
import { ServicesEditLanding } from '../pages /ServicesEditLanding';
import { ServicesInfoLanding } from '../pages /ServicesViewLanding';
import { SetupWizard } from '../pages /SetupWizard';
import { UpgradeWizard } from '../pages /UpgradeWizard';
import { PrivateRoute } from '../utils/PrivateRoute';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  // for minidrawer menu open
  const [open, setOpen] = React.useState(false);
  return (
    <StyledApp>
      <Router>
        {/* Auth provided to configure private routes only after login */}
        <AuthProvider>
          <MiniDrawer open={open} setOpen={setOpen} />

          {/* Routes configured for each page  */}

          {/* Main component used for placement of page with alignment to the menu(mini drawer) */}
          <Routes>
            <Route path="/app/controlcenter" element={<PrivateRoute />}>
              <Route
                path="/app/controlcenter/Home"
                element={
                  <Main open={open}>
                    <Home />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Hosts"
                element={
                  <Main open={open}>
                    <Hosts />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Backup"
                element={
                  <Main open={open}>
                    <BackUp />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Monitor"
                element={
                  <Main open={open}>
                    <Monitor />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Services"
                element={
                  <Main open={open}>
                    <Services />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Setupwizard"
                element={
                  <Main open={open}>
                    <SetupWizard />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Upgradewizard"
                element={
                  <Main open={open}>
                    <UpgradeWizard />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Containers"
                element={
                  <Main open={open}>
                    <ContainersInstances />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/HostsInfo"
                element={
                  <Main open={open}>
                    <HostsInfoLanding />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/ServicesInfo"
                element={
                  <Main open={open}>
                    <ServicesInfoLanding />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/AddHosts"
                element={
                  <Main open={open}>
                    <AddHosts />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/EditHosts"
                element={
                  <Main open={open}>
                    <HostsEditLanding />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/EditServices"
                element={
                  <Main open={open}>
                    <ServicesEditLanding />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/ContainersInfo"
                element={
                  <Main open={open}>
                    <ContainersInfoLanding />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Register"
                element={
                  <Main open={open}>
                    <Register />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/Login"
                element={
                  <Main open={open}>
                    <LoginPage />
                  </Main>
                }
              />
              <Route
                path="/app/controlcenter/TestAuth"
                element={
                  <Main open={open}>
                    <ProtectedPage />
                  </Main>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </StyledApp>
  );
}

export default App;
