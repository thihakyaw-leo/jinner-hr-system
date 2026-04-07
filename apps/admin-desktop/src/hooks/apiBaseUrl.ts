let rawValue = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787';

// Sometimes Vite concatenates multiple .env values when inheriting environments
if (rawValue.includes(',')) {
  rawValue = rawValue.split(',')[0].trim(); 
}

// Remove trailing slashes to prevent `//api/auth/login` formatting issues
if (rawValue.endsWith('/')) {
  rawValue = rawValue.slice(0, -1);
}

export const apiBaseUrl = rawValue;
