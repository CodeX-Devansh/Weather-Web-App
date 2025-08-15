import React from 'react';
import { CloudSun } from 'lucide-react';
import AboutDialog from '@/components/AboutDialog'; // Corrected Path
import { Button } from '@/components/ui/Button'; // Corrected Path

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <CloudSun className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800">WeatherScope</h1>
        </div>
        <div className='flex items-center space-x-4'>
            <p className="text-sm text-gray-500 hidden sm:block"></p>
            <AboutDialog />
        </div>
      </div>
    </header>
  );
};

export default Header;