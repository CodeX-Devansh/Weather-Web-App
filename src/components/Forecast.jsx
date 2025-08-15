import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import WeatherIcon from './WeatherIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Forecast = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Process data for the chart (next 24 hours, 8 intervals of 3 hours)
  const hourlyData = data.slice(0, 8).map(item => ({
    time: format(new Date(item.dt * 1000), 'ha'),
    temp: Math.round(item.main.temp),
  }));

  // Process data for 5-day forecast by taking one reading per day
  const dailyData = data
    .filter((item, index) => index % 8 === 0) // Takes the first forecast for each 24h period
    .slice(0, 5) // Ensures we only have 5 days
    .map(item => ({
      date: format(new Date(item.dt * 1000), 'eee'),
      temp_max: Math.round(item.main.temp_max),
      temp_min: Math.round(item.main.temp_min),
      icon: item.weather[0].icon,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Temperature Trend (Next 24h)</h4>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={hourlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" name="Temp" unit="°C" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          {dailyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center p-2 rounded-md bg-muted/50">
              <p className="font-semibold">{day.date}</p>
              <WeatherIcon iconCode={day.icon} className="w-12 h-12" />
              <div className="flex space-x-2">
                <p className="font-bold">{day.temp_max}°</p>
                <p className="text-muted-foreground">{day.temp_min}°</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forecast;