import React from 'react';
import { useSelector } from 'react-redux';
import LocationSearch from '@/components/LocationSearch';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import PreviousSearches from '@/components/PreviousSearches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertCircle, Wind } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

const HomePage = () => {
  const { weather, forecast, loading, error, location } = useSelector((state) => state.weather);

  return (
    <div className="space-y-8">
      <LocationSearch />

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && weather && (
         <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <CurrentWeather data={weather} location={location} />
            <Forecast data={forecast} />
          </div>
          <div className="md:col-span-1">
             <PreviousSearches />
          </div>
        </div>
      )}

      {!loading && !weather && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Welcome to WeatherScope</CardTitle>
            </CardHeader>
            <CardContent>
                <Wind className="mx-auto h-12 w-12 text-blue-500" />
                <p className="mt-4 text-muted-foreground">
                    Enter a location above or use your current location to get the latest weather updates.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePage;