// Example: Custom hook for fetching movies
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useMoviesSearch(query, mode) {
    console.log('[useMoviesSearch] called with:', { query, mode });
    return useQuery({
        queryKey: ['movies', mode, query],
        queryFn: async () => {
            if (!query) return [];
            let endpoint;
            if (mode === 'semantic') {
                endpoint = `http://moviesense-backend:8000/imdb/movies/semantic_search/?q=${encodeURIComponent(query)}`;
            } else {
                endpoint = `http://moviesense-backend:8000/imdb/movies/full_text_search/?q=${encodeURIComponent(query)}`;
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
