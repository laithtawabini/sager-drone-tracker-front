import { X } from 'lucide-react';
import { Button } from './ui/button';
import DronePanelItem from './DronePanelItem';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { useState } from 'react';
import { setCancelSelectionOnMapDrag, setShowSelectedPathOnly } from '@/features/options/optionsSlice';
import type { DroneData } from '@/types/droneData';
import { Switch } from './ui/switch';

function Panel({ onClose }: { onClose: () => void; }) {
  const drones = useSelector((state: RootState) => state.drone.history);
  const options = useSelector((state: RootState) => state.options);
  const dispatch = useDispatch();
  const [panelSelection, setPanelSelection] = useState<'drones' | 'history'>('drones');

  return (
    <div className="absolute h-[80%]  top-2 left-2 z-50 w-[400px] bg-primary shadow-lg text-primary-foreground">
      <div className="flex justify-between items-center px-4 py-6">
        <span className="font-bold text-lg">DRONE FLYING</span>
        <button onClick={onClose} className="text-gray-400 hover:text-primary-foreground">
          <X />
        </button>
      </div>
      <div className="relative flex justify-around">
        <Button
          className={`relative flex-1 ${panelSelection === 'drones' ? 'font-bold' : 'text-secondary-foreground'}`}
          onClick={() => setPanelSelection('drones')}
        >
          Drones
        </Button>
        
        <Button
          className={`relative flex-1 ${panelSelection === 'history' ? 'font-bold' : 'text-secondary-foreground'}`}
          onClick={() => setPanelSelection('history')}
        >
          Flights History
        </Button>

        <div
          className="absolute bottom-0 h-1 w-1/4 bg-sidebar-accent transition-all duration-300"
          style={{ left: panelSelection === 'drones' ? '12.5%' : '62.5%' }}
        />
      </div>
      <div className="p-4 pb-0 mb-0 overflow-y-scroll h-[calc(100%-112px)]">
        {panelSelection === 'history' ? (<div className='w-auto m-auto text-muted-foreground'>To be added</div>) : 
          drones && drones.map((drone: DroneData) => (
            <DronePanelItem key={drone.features[0].properties.serial} drone={drone} />
          ))
        }
      </div>
      

      <div className='w-auto h-32 bg-primary mt-2 p-4'>
        <span className='text-lg text-primary-foreground '><b>OPTIONS</b></span>
        <div className='flex align-'>
          <table>
            <tbody>
              <tr>
                <td className='pr-4'><span className='text-sm text-secondary-foreground '>Show selected drone's path only</span></td>
                <td>
                  <Switch
                    className="mt-2"
                    checked={options.showSelectedPathOnly}
                    onCheckedChange={(checked) => {
                      dispatch(setShowSelectedPathOnly(checked));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className='pr-4'><span className='text-sm text-secondary-foreground '>Cancel selection when dragging map</span></td>
                <td>
                  <Switch
                    className="mt-2"
                    checked={options.cancelSelectionOnMapDrag}
                    onCheckedChange={(checked) => {
                      dispatch(setCancelSelectionOnMapDrag(checked));
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Panel;