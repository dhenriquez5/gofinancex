const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

/**
 * Generalized fetch function for making API calls.
 * @param endpoint - The API endpoint (relative to the base URL)
 * @param method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE')
 * @param data - The data to be sent in the request body (optional)
 * @returns The JSON response from the API or throws an error
 */
const fetchService = async (
  endpoint: string,
  method: string = 'GET',
  data?: Record<string, any>,
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json(); // Return the parsed JSON response
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};

export default fetchService;
