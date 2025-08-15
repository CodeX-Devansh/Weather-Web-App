import React, { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { cn } from '../lib/utils';

const ExportActionMenu = ({ 
  data,
  onExport,
  className = "",
  variant = "button", // "button" | "icon"
  position = "bottom-right" // "bottom-right" | "bottom-left" | "top-right" | "top-left"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);

  const exportFormats = [
    { id: 'json', label: 'JSON', description: 'JavaScript Object Notation', icon: 'FileText', extension: '.json' },
    { id: 'csv', label: 'CSV', description: 'Comma Separated Values', icon: 'Table', extension: '.csv' },
    // Add more formats if desired (XML, PDF, Markdown, etc.)
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleExport = async (format) => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate export delay
      if (onExport) {
        onExport(format, data);
      } else {
        // Default export behavior if no handler is provided
        const exportData = generateExportData(format, data);
        downloadFile(exportData.content, exportData.filename, exportData.type);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateExportData = (format, data) => {
    const timestamp = new Date()?.toISOString()?.split('T')?.[0];
    const filename = `weather_export_${timestamp}`;

    switch (format?.id) {
      case 'json':
        return {
          content: JSON.stringify(data, null, 2),
          filename: `${filename}.json`,
          type: 'application/json'
        };
      
      case 'csv':
        const csvContent = convertToCSV(data);
        return {
          content: csvContent,
          filename: `${filename}.csv`,
          type: 'text/csv'
        };
      
      default: // Fallback to JSON
        return {
          content: JSON.stringify(data, null, 2),
          filename: `${filename}.json`,
          type: 'application/json'
        };
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data || !data.weather || !data.location || !data.forecast) return '';
    
    // Simplified CSV structure for current weather and location
    const headers = ['Location Name', 'Country', 'Temperature (°C)', 'Condition', 'Humidity (%)', 'Wind Speed (m/s)'];
    const rows = [headers.join(',')];
    
    const row = [
      data.location.name,
      data.location.country,
      Math.round(data.weather.main.temp),
      data.weather.weather[0].description,
      data.weather.main.humidity,
      data.weather.wind.speed,
    ];
    rows.push(row.join(','));
    
    return rows.join('\n');
  };

  const getMenuPosition = () => {
    const positions = {
      'bottom-right': 'top-full right-0 mt-1',
      'bottom-left': 'top-full left-0 mt-1',
      'top-right': 'bottom-full right-0 mb-1',
      'top-left': 'bottom-full left-0 mb-1'
    };
    return positions?.[position] || positions?.['bottom-right'];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <Button
        variant={variant === "icon" ? "ghost" : "outline"}
        size={variant === "icon" ? "sm" : "default"}
        onClick={toggleMenu}
        disabled={isExporting}
        iconName="Download"
        iconPosition={variant === "icon" ? undefined : "left"}
      >
        {variant !== "icon" && "Export"}
      </Button>

      {isOpen && (
        <div className={`absolute ${getMenuPosition()} w-56 bg-popover border border-border rounded-md weather-modal-shadow z-200`}>
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Export Format</div>
            <div className="space-y-1 mt-1">
              {exportFormats?.map((format) => (
                <button
                  key={format?.id}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md hover:bg-muted weather-transition group"
                >
                  <Icon name={format?.icon} size={16} className="text-muted-foreground group-hover:text-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-popover-foreground group-hover:text-foreground">{format?.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{format?.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{format?.extension}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border p-2">
            <div className="text-xs text-muted-foreground px-2">Export includes current weather and location data.</div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet for smaller screens */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-200 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-popover border-t border-border rounded-t-lg animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-popover-foreground">Export Data</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} iconName="X" />
              </div>
              <div className="space-y-2">
                {exportFormats?.map((format) => (
                  <button
                    key={format?.id}
                    onClick={() => handleExport(format)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md hover:bg-muted weather-transition"
                  >
                    <Icon name={format?.icon} size={20} className="text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-base font-medium text-popover-foreground">{format?.label}</div>
                      <div className="text-sm text-muted-foreground">{format?.description}</div>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">{format?.extension}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportActionMenu;