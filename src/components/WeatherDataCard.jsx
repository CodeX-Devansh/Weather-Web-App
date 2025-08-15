import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Droplets, Wind, Sunrise, Sunset, MapPin, Gauge, Eye, Calendar, BarChart3, Heart, HeartOff, Download, ChevronDown, ChevronUp, Search, X, Loader2 } from 'lucide-react'; // Import all needed icons

const WeatherDataCard = ({ 
  location,
  currentWeather,
  forecast = [],
  variant = 'default', // 'hero', 'detailed', 'compact'
  showActions = true,
  onSave,
  onCompare,
  onExport,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const weatherData = {
    location: location || {
      name: 'New York', country: 'United States', region: 'NY', localTime: '2025-08-13 08:33'
    },
    current: currentWeather || {
      temperature: 24, feelsLike: 26, humidity: 65, windSpeed: 12, windDirection: 'NW', pressure: 1013, visibility: 10, uvIndex: 6,
      weather: [{ icon: '02d', description: 'Partly Cloudy' }] // Mock weather info
    },
    forecast: forecast?.length > 0 ? forecast : [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: '02d', precipitation: 10 },
      { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: '01d', precipitation: 0 },
      { day: 'Thursday', high: 25, low: 17, condition: 'Rainy', icon: '10d', precipitation: 80 },
      { day: 'Friday', high: 23, low: 16, condition: 'Cloudy', icon: '04d', precipitation: 20 },
      { day: 'Saturday', high: 27, low: 19, condition: 'Sunny', icon: '01d', precipitation: 5 },
    ]
  };

  // Mapping icon codes to Lucide React icons
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'Sun', '01n': 'Moon', // Using Moon for night
      '02d': 'CloudSun', '02n': 'CloudMoon',
      '03d': 'Cloud', '03n': 'Cloud',
      '04d': 'Cloud', '04n': 'Cloud',
      '09d': 'CloudRain', '09n': 'CloudRain',
      '10d': 'CloudRain', '10n': 'CloudRain',
      '11d': 'CloudLightning', '11n': 'CloudLightning',
      '13d': 'Snowflake', '13n': 'Snowflake',
      '50d': 'CloudDrizzle', '50n': 'CloudDrizzle', // Using Drizzle for fog for visual variety
    };
    return iconMap?.[iconCode] || 'Sun'; // Default to Sun
  };

  const handleSave = () => { setIsSaved(!isSaved); onSave?.(weatherData?.location); };
  const handleCompare = () => onCompare?.(weatherData?.location);
  const handleExport = () => onExport?.(weatherData);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // --- Render Logic for Variants ---

  // Hero Variant: Large display for main weather card
  if (variant === 'hero') {
    return (
      <div className={`bg-card rounded-lg weather-card-shadow p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-card-foreground mb-1">{weatherData?.location?.name}</h1>
            <p className="text-muted-foreground">{weatherData?.location?.region}, {weatherData?.location?.country}</p>
            <p className="text-sm text-muted-foreground font-mono">{weatherData?.location?.localTime}</p>
          </div>
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleSave} iconName={isSaved ? "Heart" : "HeartOff"} className={isSaved ? "text-error" : ""} />
              <Button variant="ghost" size="sm" onClick={handleCompare} iconName="BarChart3" />
              <Button variant="ghost" size="sm" onClick={handleExport} iconName="Download" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Icon name={getWeatherIcon(weatherData?.current?.weather?.[0]?.icon)} size={64} className="text-primary" />
            <div>
              <div className="text-5xl font-semibold text-card-foreground">{Math.round(weatherData?.current?.temperature)}°C</div>
              <div className="text-muted-foreground">Feels like {Math.round(weatherData?.current?.feelsLike)}°C</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-card-foreground mb-1">{weatherData?.current?.condition}</div>
            <div className="text-sm text-muted-foreground">UV Index: {weatherData?.current?.uvIndex}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { icon: 'Droplets', value: `${weatherData?.current?.humidity}%`, label: 'Humidity' },
            { icon: 'Wind', value: `${weatherData?.current?.windSpeed} m/s`, label: 'Wind' },
            { icon: 'Gauge', value: `${weatherData?.current?.pressure} mb`, label: 'Pressure' },
            { icon: 'Eye', value: `${weatherData?.current?.visibility} km`, label: 'Visibility' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <Icon name={item.icon} size={20} className="text-primary mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-card-foreground">3-Day Forecast</h3>
            <Button variant="ghost" size="sm" onClick={toggleExpanded} iconName={isExpanded ? "ChevronUp" : "ChevronDown"}>{isExpanded ? "Less" : "More"}</Button>
          </div>
          <div className="space-y-2">
            {weatherData?.forecast?.slice(0, isExpanded ? weatherData?.forecast?.length : 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <Icon name={getWeatherIcon(day?.icon)} size={24} className="text-primary" />
                  <div>
                    <div className="font-medium text-card-foreground">{day?.day}</div>
                    <div className="text-sm text-muted-foreground">{day?.condition}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-right">
                  <div className="text-sm text-muted-foreground"><Icon name="CloudRain" size={14} className="inline mr-1" />{day?.precipitation}%</div>
                  <div className="font-medium"><span className="text-card-foreground">{day?.high}°</span><span className="text-muted-foreground ml-1">{day?.low}°</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact Variant: For lists or smaller displays
  if (variant === 'compact') {
    return (
      <div className={`bg-card rounded-lg weather-card-shadow p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={getWeatherIcon(weatherData?.current?.weather?.[0]?.icon)} size={32} className="text-primary" />
            <div>
              <div className="font-medium text-card-foreground">{weatherData?.location?.name}</div>
              <div className="text-sm text-muted-foreground">{weatherData?.current?.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-card-foreground">{Math.round(weatherData?.current?.temperature)}°C</div>
            <div className="text-sm text-muted-foreground">{weatherData?.forecast?.[0]?.high}° / {weatherData?.forecast?.[0]?.low}°</div>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center justify-end space-x-1 mt-3 pt-3 border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleSave} iconName={isSaved ? "Heart" : "HeartOff"} className={isSaved ? "text-error" : ""} />
            <Button variant="ghost" size="sm" onClick={handleCompare} iconName="BarChart3" />
          </div>
        )}
      </div>
    );
  }

  // Default Variant: Detailed view for main display
  return (
    <div className={`bg-card rounded-lg weather-card-shadow p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-1">{weatherData?.location?.name}</h2>
          <p className="text-sm text-muted-foreground">{weatherData?.location?.region}, {weatherData?.location?.country}</p>
        </div>
        {showActions && (
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handleSave} iconName={isSaved ? "Heart" : "HeartOff"} className={isSaved ? "text-error" : ""} />
            <Button variant="ghost" size="sm" onClick={handleCompare} iconName="BarChart3" />
            <Button variant="ghost" size="sm" onClick={handleExport} iconName="Download" />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <Icon name={getWeatherIcon(weatherData?.current?.weather?.[0]?.icon)} size={48} className="text-primary" />
        <div>
          <div className="text-3xl font-semibold text-card-foreground">{Math.round(weatherData?.current?.temperature)}°C</div>
          <div className="text-muted-foreground">{weatherData?.current?.condition}</div>
          <div className="text-sm text-muted-foreground">Feels like {weatherData?.current?.feelsLike}°C</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: 'Droplets', value: `${weatherData?.current?.humidity}%`, label: 'Humidity' },
          { icon: 'Wind', value: `${weatherData?.current?.windSpeed} m/s`, label: 'Wind' },
          { icon: 'Gauge', value: `${weatherData?.current?.pressure} mb`, label: 'Pressure' },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <Icon name={item.icon} size={16} className="text-primary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-3">
        <div className="text-sm font-medium text-card-foreground mb-2">Today's Forecast</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name={getWeatherIcon(weatherData?.forecast?.[0]?.icon)} size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">{weatherData?.forecast?.[0]?.condition}</span>
          </div>
          <div className="text-sm font-medium">
            <span className="text-card-foreground">{weatherData?.forecast?.[0]?.high}°</span>
            <span className="text-muted-foreground ml-1">{weatherData?.forecast?.[0]?.low}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDataCard;