
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDrone } from '@/features/drone/droneSlice';
import type { DroneData } from '@/types/droneData';
import type { RootState } from '@/store';

function DronePanelItem({ drone }: { drone: DroneData }) {
  const props = drone.features[0].properties;
  const statusColor = props.registration.startsWith('SD-B') ? 'bg-green-500' : 'bg-red-500';
  const dispatch = useDispatch();
  const selectedDroneRegistration = useSelector((state: RootState) => state.drone.selectedDroneRegistration);
  const registration = drone.features[0].properties.registration;

  function onItemClick() {
    if (selectedDroneRegistration === props.registration) {
      dispatch(setSelectedDrone(null));
    } else {
      dispatch(setSelectedDrone(props.registration));
    }
  }

  return (
    <div
      className={`hover:brightness-90 hover:cursor-pointer ${selectedDroneRegistration === registration ? 'brightness-80' : 'brightness-100'} bg-primary border-b-1 border-t-1 border-black px-4 py-3`}
      onClick={onItemClick}
    >
      <div className="flex items-center">
        <span className="text-xl font-bold text-primary-foreground">{props.Name}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-1 justify-between mt-2">
          <div>
            <div className="text-xs text-secondary-foreground">Serial #</div>
            <div className="font-bold text-primary-foreground text-sm">{props.serial}</div>
            <div className="text-xs text-secondary-foreground mt-2">Pilot</div>
            <div className="font-bold text-primary-foreground text-sm">{props.pilot}</div>
          </div>
          <div className="text-left">
            <div className="text-xs text-secondary-foreground">Registration #</div>
            <div className="font-bold text-primary-foreground text-sm">{props.registration}</div>
            <div className="text-xs text-secondary-foreground mt-2">Organization</div>
            <div className="font-bold text-primary-foreground text-sm">{props.organization}</div>
          </div>
        </div>
        <span className={`ml-5 mt-5 w-6 h-6 rounded-full border-2 border-white ${statusColor}`} />
      </div>
    </div>
  );
}

export default DronePanelItem;