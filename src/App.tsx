import { useState } from 'react';
import useDroneSocket from './hooks/useDroneSocket';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import Dashboard from './components/Dashboard';


function App() {
  useDroneSocket();
  const [sideBarOption, setSideBarOption] = useState<'DASHBOARD' | 'MAP'>('MAP');

  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden'>
      <Navbar />
      <div className='flex flex-1 h-full w-full'>
        <Sidebar sideBarOption={sideBarOption} setSideBarOption={setSideBarOption} />
        <div className='flex-1 h-full w-full relative'>
          <div className={sideBarOption === 'MAP' ? 'w-full h-full' : 'hidden'}>
            <Map />
          </div>
          <div className={sideBarOption === 'DASHBOARD' ? 'w-full h-full' : 'hidden'}>
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
