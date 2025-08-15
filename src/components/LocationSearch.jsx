import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherByCoords, fetchWeatherByQuery } from '@/features/weather/weatherSlice'; // Corrected Path
import useCurrentLocation from '@/hooks/useCurrentLocation'; // Corrected Path
import { Input } from '@/components/ui/Input'; // Corrected Path
import { Button } from '@/components/ui/Button'; // Corrected Path
import { MapPin, Search } from 'lucide-react';
import Spinner from '@/components/ui/Spinner'; // Corrected Path

// ... (rest of the component logic is the same)
const LocationSearch = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { getLocation, loading: locationLoading, error: locationError } = useCurrentLocation();
  const { loading: weatherLoading } = useSelector(state => state.weather);

  const onSubmit = (data) => {
    dispatch(fetchWeatherByQuery(data.location));
  };

  const handleGetCurrentLocation = async () => {
    try {
      const position = await getLocation();
      if (position) {
        const { latitude, longitude } = position.coords;
        dispatch(fetchWeatherByCoords({ lat: latitude, lon: longitude }));
      }
    } catch (err) {
      // Error is handled by the hook and displayed
    }
  };

  const isLoading = locationLoading || weatherLoading;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('location', { required: 'Location is required' })}
            placeholder="Enter City, Zip Code, or Landmark..."
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && !locationLoading ? <Spinner size="sm" className="mr-2"/> : <Search className="mr-2 h-4 w-4" />} Search
            </Button>
            <Button type="button" variant="outline" onClick={handleGetCurrentLocation} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && locationLoading ? <Spinner size="sm" className="mr-2"/> : <MapPin className="mr-2 h-4 w-4" />} My Location
            </Button>
        </div>
      </form>
      {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
      {locationError && <p className="text-destructive text-sm mt-1">{locationError}</p>}
    </div>
  );
};

export default LocationSearch;