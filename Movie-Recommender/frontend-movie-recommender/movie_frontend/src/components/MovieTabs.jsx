import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useMoviesSearch } from '../hooks/useMoviesSearch';
import { useDebounce } from 'use-debounce';
import { MagnifyingGlassIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


export default function MovieSearchTabs() {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('normal');
    const [debouncedQuery] = useDebounce(query, 700);
    const navigate = useNavigate();

    // Always call the hook, pass mode and debouncedQuery
    const {
        data: results = [],
        isLoading,
        error
    } = useMoviesSearch(debouncedQuery, mode);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    const handleTabChange = (index) => {
        setMode(index === 0 ? 'normal' : 'semantic');
        setQuery(''); // clear query when switching tabs
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Tab.Group onChange={handleTabChange}>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1 mb-4">
                    {[{
                        label: 'Normal Search',
                        icon: <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
                    }, {
                        label: 'Semantic Search',
                        icon: <LightBulbIcon className="w-5 h-5 inline mr-2" />
                    }
                    ].map(({ label, icon }) => (
                        <Tab
                            key={label}
                            className={({ selected }) =>
                                `w-full py-2.5 text-sm leading-5 font-medium rounded-lg ${selected ? 'bg-yellow-400 text-gray-900 shadow' : 'text-yellow-400 hover:bg-yellow-200 hover:text-gray-900'}`
                            }
                        >
                            {icon}{label}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="relative flex justify-center">
                            <input
                                type="text"
                                value={mode === 'normal' ? query : ''}
                                onChange={handleInputChange}
                                placeholder="Search for movies (normal mode)"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        {isLoading && <p className="text-yellow-400 mt-4">Loading...</p>}
                        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
                        {results.length > 0 && (
                            <ul className="mt-4 space-y-2">
                                {results.map((movie) => (
                                    <li
                                        key={movie.id}
                                        className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-yellow-100 hover:text-gray-900 transition flex items-center gap-4"
                                        onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                                    >
                                        {/* Poster */}
                                        <div className="w-12 h-20 flex-shrink-0 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-yellow-400">{movie.title}</h3>
                                            <p className="text-gray-400 text-sm">{movie.genres}</p>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="relative flex justify-center">
                            <input
                                type="text"
                                value={mode === 'semantic' ? query : ''}
                                onChange={handleInputChange}
                                placeholder="Search for movies (semantic mode)"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        {isLoading && <p className="text-yellow-400 mt-4">Loading...</p>}
                        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
                        {results.length > 0 && (
                            <ul className="mt-4 space-y-2">
                                {results.map((movie) => (
                                    <li
                                        key={movie.id}
                                        className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-yellow-100 hover:text-gray-900 transition flex items-center gap-4"
                                        onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                                    >
                                        {/* Poster */}
                                        <div className="w-12 h-20 flex-shrink-0 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-yellow-400">{movie.title}</h3>
                                            <p className="text-gray-400 text-sm">{movie.genres}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}
