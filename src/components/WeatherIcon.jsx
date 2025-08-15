import React from 'react';
import {
  Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, CloudFog
} from 'lucide-react';
import { cn } from '../lib/utils';

const iconMap = {
  '01d': <Sun className="text-yellow-500" />,
  '01n': <Sun className="text-gray-400" />, // Using Sun for clear night for visual clarity
  '02d': <CloudSun className="text-yellow-500" />,
  '02n': <CloudSun className="text-gray-400" />,
  '03d': <Cloud className="text-gray-500" />,
  '03n': <Cloud className="text-gray-500" />,
  '04d': <Cloud className="text-gray-600" />,
  '04n': <Cloud className="text-gray-600" />,
  '09d': <CloudRain className="text-blue-500" />,
  '09n': <CloudRain className="text-blue-500" />,
  '10d': <CloudRain className="text-blue-600" />,
  '10n': <CloudRain className="text-blue-600" />,
  '11d': <CloudLightning className="text-yellow-600" />,
  '11n': <CloudLightning className="text-yellow-600" />,
  '13d': <CloudSnow className="text-blue-300" />,
  '13n': <CloudSnow className="text-blue-300" />,
  '50d': <CloudFog className="text-gray-400" />,
  '50n': <CloudFog className="text-gray-400" />,
};

const WeatherIcon = ({ iconCode, className }) => {
  const icon = iconMap[iconCode] || <Sun />; // Default to Sun icon if code is unknown
  return React.cloneElement(icon, {
    className: cn('w-16 h-16', className, icon.props.className),
  });
};

export default WeatherIcon;