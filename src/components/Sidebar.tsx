import { Gauge, MapPin } from 'lucide-react';
import SidebarItem from './SidebarItem';

export type SidebarOption = 'DASHBOARD' | 'MAP';

interface SidebarProps {
  sideBarOption: SidebarOption;
  setSideBarOption: (option: SidebarOption) => void;
}

function Sidebar({ sideBarOption, setSideBarOption }: SidebarProps) {
  return (
    <div className="h-full w-40 bg-secondary flex flex-col items-center py-8 gap-2">
      <SidebarItem
        icon={<Gauge className="h-10 w-10" />}
        label="DASHBOARD"
        selected={sideBarOption === 'DASHBOARD'}
        onClick={() => setSideBarOption('DASHBOARD')}
      />
      <SidebarItem
        icon={<MapPin className="h-10 w-10" />}
        label="MAP"
        selected={sideBarOption === 'MAP'}
        onClick={() => setSideBarOption('MAP')}
      />
    </div>
  );
}

export default Sidebar;

