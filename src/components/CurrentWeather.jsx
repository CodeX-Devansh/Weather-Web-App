import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Droplets, Wind, Sunrise, Sunset, MapPin } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const CurrentWeather = ({ data, location }) => {
  if (!data || !location) return null;

  const {
    main: { temp, feels_like, humidity },
    weather,
    wind: { speed },
    sys: { sunrise, sunset },
  } = data;

  const weatherInfo = weather[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl">{location.name}, {location.country}</CardTitle>
                <CardDescription>
                {format(new Date(), 'eeee, MMMM d')}
                </CardDescription>
            </div>
            <a 
                href={`https://www.google.com/maps?q=${location.lat},${location.lon}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center pt-1"
            >
                <MapPin className="h-4 w-4 mr-1" /> View on Map
            </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WeatherIcon iconCode={weatherInfo.icon} className="w-20 h-20" />
            <div className='ml-4'>
              <p className="text-6xl font-bold">{Math.round(temp)}°C</p>
              <p className="text-muted-foreground capitalize">{weatherInfo.description}</p>
            </div>
          </div>
          <div className="text-right text-muted-foreground">
            <p>Feels like {Math.round(feels_like)}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
            <Droplets className="h-6 w-6 text-blue-500" />
            <p className="font-bold mt-1">{humidity}%</p>
            <p className="text-xs text-muted-foreground">Humidity</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
            <Wind className="h-6 w-6 text-gray-500" />
            <p className="font-bold mt-1">{speed.toFixed(1)} m/s</p>
            <p className="text-xs text-muted-foreground">Wind</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
            <Sunrise className="h-6 w-6 text-amber-500" />
            <p className="font-bold mt-1">{format(new Date(sunrise * 1000), 'p')}</p>
            <p className="text-xs text-muted-foreground">Sunrise</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
            <Sunset className="h-6 w-6 text-orange-500" />
            <p className="font-bold mt-1">{format(new Date(sunset * 1000), 'p')}</p>
            <p className="text-xs text-muted-foreground">Sunset</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;