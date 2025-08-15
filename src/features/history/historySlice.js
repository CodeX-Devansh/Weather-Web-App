import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHistory, deleteSearchFromHistory, updateSearchInHistory } from '../../api/supabase';
import { downloadFile, convertToCSV } from '../../lib/utils'; // We will create this file

export const fetchHistory = createAsyncThunk('history/fetchHistory', async (_, { rejectWithValue }) => {
  try {
    const data = await getHistory();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteHistory = createAsyncThunk('history/deleteHistory', async (id, { rejectWithValue }) => {
  try {
    await deleteSearchFromHistory(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateHistory = createAsyncThunk('history/updateHistory', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const data = await updateSearchInHistory(id, updates);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const exportHistory = createAsyncThunk('history/exportHistory', async (format, { getState }) => {
  const { items } = getState().history;
  
  if (format === 'json') {
    const jsonString = JSON.stringify(items, null, 2);
    downloadFile(jsonString, 'weather_history.json', 'application/json');
  } else if (format === 'csv') {
    const csvString = convertToCSV(items);
    downloadFile(csvString, 'weather_history.csv', 'text/csv');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateHistory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
        }
      });
  },
});

export const selectHistory = (state) => state.history;
export default historySlice.reducer;