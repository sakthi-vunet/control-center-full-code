import * as React  from 'react';
import styled from '@emotion/styled';
import { Home } from '../pages /Home';
import { Hosts } from '../pages /Hosts';
import { BackUp } from '../pages /Backup';
import { Monitor } from '../pages /Monitor';
import { SetupWizard } from '../pages /SetupWizard';
import { UpgradeWizard } from '../pages /UpgradeWizard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContainersInstances } from '../pages /Containers';
import { HostsInfoLanding } from '../pages /HostsViewLanding';
import MiniDrawer from '../layout/MiniDrawer';
import { Services } from '../pages /Services';
import { ServicesInfoLanding } from '../pages /ServicesViewLanding';
import { AddHosts } from '../pages /AddHosts';
import { HostsEditLanding } from '../pages /HostsEditLanding';
import { ServicesEditLanding } from '../pages /ServicesEditLanding';
import { ContainersInfoLanding } from '../pages /ContainersViewLanding';
import { Main } from '../layout/MiniDrawer';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  const [open, setOpen] = React.useState(false);
    return (
    
    <StyledApp>
    
      <Router>

      <MiniDrawer open={open} setOpen={setOpen} />
         
         
        <Routes>

          {/* <Route path='/app/controlcenter' element={<Home/>} />
          <Route path='/app/controlcenter/Hosts' element={<Hosts/>} />
          <Route path='/app/controlcenter/Backup' element={<BackUp/>} />
          <Route path='/app/controlcenter/Monitor' element={<Monitor/>} />
          <Route path='/app/controlcenter/Services' element={<Services/>} />
          <Route path='/app/controlcenter/Setupwizard' element={<SetupWizard/>} />
          <Route path='/app/controlcenter/Upgradewizard' element={<UpgradeWizard/>} />
          <Route path='/app/controlcenter/Containers' element={<ContainersInstances/>}/>
          <Route path='/app/controlcenter/HostsInfo' element={<HostsInfoLanding />}/>
          <Route path='/app/controlcenter/ServicesInfo' element={<ServicesInfoLanding/>}/>
          <Route path='/app/controlcenter/AddHosts' element={<AddHosts/>}/>
          <Route path='/app/controlcenter/EditHosts' element={<HostsEditLanding/>}/>
          <Route path='/app/controlcenter/EditServices' element={<ServicesEditLanding/>}/>
          <Route path='/app/controlcenter/ContainersInfo' element={<ContainersInfoLanding/>}/>
           */}
             <Route
            path="/app/controlcenter"
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
        </Routes>
      </Router>
     
      

    </StyledApp>
  );
}

export default App;
