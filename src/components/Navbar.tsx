import sagerLogo from '@/assets/sager_logo.svg';
import { Button } from './ui/button';
import { Bell, Globe, Focus } from 'lucide-react';

function Navbar() {
  return (
    <div className="bg-primary flex items-center h-16 p-10 pl-4 w-full">
      <img src={sagerLogo} alt="Sager Logo" className="h-8 w-auto mr-4" />
      <div className='ml-auto text-primary-foreground flex gap-2'>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer size-10">
          <Focus className="!size-6" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer size-10">
          <Globe className="!size-6" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer size-10">
          <Bell className="!size-6" />
        </Button>
      </div>
      <div className='w-[1px] h-10 bg-gray-700 mx-5'></div>
      <div className='flex-col text-left'>
        <p className='text-sm text-primary-foreground '>Hello, <b>Laith Tawabini</b></p>
        <p className='text-xs text-secondary-foreground'>Technical Support</p>
      </div>
    </div>
  );
}

export default Navbar;      