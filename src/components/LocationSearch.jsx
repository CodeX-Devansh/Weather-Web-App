import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// CORRECTED: Importing only the functions that actually exist now
import { handleSearch, fetchWeatherByCoords } from '@/features/weather/weatherSlice';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Search } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

const LocationSearch = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const { getLocation, loading: locationLoading } = useCurrentLocation();
  // CORRECTED: We no longer need locationSuggestions
  const { loading, error } = useSelector(state => state.weather);

  // The main form submission now calls our single, robust search thunk
  const onSubmit = (data) => {
    if (data.location) {
      dispatch(handleSearch(data.location));
    }
  };
  
  const handleGetCurrentLocation = async () => {
    try {
      const position = await getLocation();
      if (position) {
        dispatch(fetchWeatherByCoords({ lat: position.coords.latitude, lon: position.coords.longitude }));
      }
    } catch (err) {
      // The slice will handle and display the error
    }
  };

  const isLoading = locationLoading || loading;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('location', { required: true })}
            placeholder="Search City, State, Postal Code, or Coordinates..."
            className="pl-10"
            disabled={isLoading}
            autoComplete="off"
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
      
      {/* REMOVED: The entire suggestions dropdown is gone, as it was the source of our problems. */}
      {/* The main error display in HomePage.jsx will now handle all feedback. */}
    </div>
  );
};

export default LocationSearch;
