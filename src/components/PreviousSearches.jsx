import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory, deleteHistory, updateHistory, selectHistory, exportHistory } from '@/features/history/historySlice'; // Corrected Path
import { setWeatherFromHistory } from '@/features/weather/weatherSlice'; // Corrected Path
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'; // Corrected Path
import { Button } from '@/components/ui/Button'; // Corrected Path
import { Trash2, Edit, Download, History } from 'lucide-react';
import Spinner from '@/components/ui/Spinner'; // Corrected Path
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'; // Corrected Path
import { Input } from '@/components/ui/Input'; // Corrected Path
import { useForm } from 'react-hook-form';

// ... (rest of the component logic is the same)
const PreviousSearches = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(selectHistory);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleSelect = (item) => dispatch(setWeatherFromHistory(item));
  const handleDelete = (id) => dispatch(deleteHistory(id));
  const handleExport = (format) => dispatch(exportHistory(format));

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setValue('location_name', item.location_name);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data) => {
    if (currentItem) {
      dispatch(updateHistory({ id: currentItem.id, updates: { location_name: data.location_name } }));
      setIsEditDialogOpen(false);
      setCurrentItem(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><History className="mr-2 h-6 w-6" /> Search History</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {loading && <div className="flex justify-center"><Spinner /></div>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && items.length === 0 && <p className="text-muted-foreground text-center">No previous searches.</p>}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
              <button onClick={() => handleSelect(item)} className="text-left flex-grow truncate pr-2">
                <span className="font-medium">{item.location_name}</span>
              </button>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('json')} disabled={items.length === 0}><Download className="mr-2 h-4 w-4" /> JSON</Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')} disabled={items.length === 0}><Download className="mr-2 h-4 w-4" /> CSV</Button>
      </CardFooter>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Edit Location Name</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                <Input {...register('location_name', { required: true })} />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
export default PreviousSearches;