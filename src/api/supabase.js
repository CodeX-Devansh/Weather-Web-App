import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLE_NAME = 'weather_searches';

export const getHistory = async () => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const addSearchToHistory = async (searchData) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([searchData])
        .select();
    if (error) throw error;
    return data[0];
};

export const updateSearchInHistory = async (id, updates) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select();
    if (error) throw error;
    return data[0];
};

export const deleteSearchFromHistory = async (id) => {
    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);
    if (error) throw error;
    return id;
};