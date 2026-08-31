import {ErrorResponse} from 'hybrid-types/MessageTypes';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const errorJson = json as unknown as ErrorResponse;
    if (import.meta.env.VITE_NODE_ENV === 'development2') {
      console.log('errorJson', errorJson);
    }
    if (errorJson.message) {
      throw new Error(errorJson.message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

// Utility function to format filesize, Crafted with GitHub coding tools
const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

const formatDate = (date: string, lang: string) => {
  return new Date(date).toLocaleString(lang);
};

export {fetchData, formatFileSize, formatDate};
