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


const StyledApp = styled.div`
  // Your style here
`;

export function App() {
    return (
    
    <StyledApp>
    
      <Router>

         <MiniDrawer/>
         
         
        <Routes>

          <Route path='/app/controlcenter' element={<Home/>} />
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
          
        </Routes>
      </Router>
     
      

    </StyledApp>
  );
}

export default App;
