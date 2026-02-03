// Example: Custom hook for fetching movies
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND = "";
export function useMoviesSearch(query, mode) {
    console.log('[useMoviesSearch] called with:', { query, mode });
    return useQuery({
        queryKey: ['movies', mode, query],
        queryFn: async () => {
            if (!query) return [];
            let endpoint;
            if (mode === 'semantic') {
                endpoint = `${BACKEND}/imdb/movies/semantic_search/?q=${encodeURIComponent(query)}`;
            } else {
                endpoint = `${BACKEND}/imdb/movies/full_text_search/?q=${encodeURIComponent(query)}`;
            }
            const { data } = await axios.get(endpoint, { validateStatus: () => true });
            // Defensive: check if data is an object and has results
            if (typeof data === 'object' && data !== null && Array.isArray(data.results)) {
                console.log('[useMoviesSearch] fetched data:', data);
                return data.results;
            } else {
                console.warn('[useMoviesSearch] Unexpected API response:', data);
                return [];
            }
        },
        enabled: !!query,
    });
}

// Example: Function for user login
export async function loginUser(form) {
    const BACKEND = "";
    const response = await axios.post(`${BACKEND}/api/auth/jwt/login/`, form, { withCredentials: true });
    return response.data;
}
