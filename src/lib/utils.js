import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to trigger file download in the browser
export function downloadFile(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// Function to convert history data to a CSV string
export function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = ['id', 'created_at', 'location_name', 'latitude', 'longitude', 'temp_c', 'weather_description'];
  const rows = data.map(item => [
    item.id,
    item.created_at,
    `"${item.location_name.replace(/"/g, '""')}"`,
    item.latitude,
    item.longitude,
    item.weather_data.weather.main.temp,
    `"${item.weather_data.weather.weather[0].description.replace(/"/g, '""')}"`,
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
}