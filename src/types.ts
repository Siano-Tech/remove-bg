export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface ExportSettings {
  format: 'png' | 'jpeg';
  quality: number;
}