import React from 'react';
import { Download, Package } from 'lucide-react';
import { ExportSettings } from '../types';

interface Props {
  onExportAll: () => void;
  settings: ExportSettings;
  onSettingsChange: (settings: ExportSettings) => void;
  hasProcessedImages: boolean;
}

export default function ExportPanel({
  onExportAll,
  settings,
  onSettingsChange,
  hasProcessedImages
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
        Export Settings
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            value={settings.format}
            onChange={(e) => onSettingsChange({
              ...settings,
              format: e.target.value as 'png' | 'jpeg'
            })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quality
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) => onSettingsChange({
              ...settings,
              quality: Number(e.target.value)
            })}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">
            {settings.quality}%
          </div>
        </div>

        <button
          onClick={onExportAll}
          disabled={!hasProcessedImages}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white
            ${hasProcessedImages
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>
    </div>
  );
}