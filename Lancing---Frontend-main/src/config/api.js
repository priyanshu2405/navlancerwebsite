const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:5000';

export { API_BASE_URL, MEDIA_BASE_URL };
export default API_BASE_URL;
