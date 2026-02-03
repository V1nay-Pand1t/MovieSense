import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND = "";

export function useMoviesExplore(page = 1, pageSize = 20, letter = null) {
    return useQuery({
        queryKey: ['movies-explore', page, pageSize, letter],
        queryFn: async () => {
            let endpoint = `${BACKEND}/imdb/movies/explore/?page=${page}&page_size=${pageSize}`;

            if (letter && letter !== 'All') {
                endpoint += `&letter=${letter}`;
            }

            const { data } = await axios.get(endpoint, { validateStatus: () => true });

            // Defensive: check if data is an object and has results
            if (typeof data === 'object' && data !== null) {
                return {
                    results: Array.isArray(data.results) ? data.results : [],
                    count: data.count || 0,
                    next: data.next || null,
                    previous: data.previous || null,
                    total_pages: data.total_pages || Math.ceil((data.count || 0) / pageSize)
                };
            } else {
                console.warn('[useMoviesExplore] Unexpected API response:', data);
                return { results: [], count: 0, next: null, previous: null, total_pages: 0 };
            }
        },
    });
}
