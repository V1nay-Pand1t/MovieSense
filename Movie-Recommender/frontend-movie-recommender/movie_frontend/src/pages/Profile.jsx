import React, { useState, useRef } from 'react';
import { useUser } from '../components/UserContext';
import NavigationUI from '../components/NavigationUI';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for rating color
const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-green-600';
    if (rating >= 7) return 'bg-yellow-500';
    if (rating >= 5) return 'bg-orange-500';
    return 'bg-red-600';
};

export default function Profile() {
    const { user } = useUser();

    const [watchlist] = useState([
        { id: 1, title: 'Inception', rating: 8.8, year: 2010, description: 'A thief who steals corporate secrets through the use of dream-sharing technology.', poster_path: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg', director: 'Christopher Nolan', vote_average: 8.8 },
        { id: 2, title: 'The Matrix', rating: 8.7, year: 1999, description: 'A computer hacker learns about the true nature of his reality.', poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', director: 'Lana Wachowski', vote_average: 8.7 },
        { id: 3, title: 'Interstellar', rating: 8.6, year: 2014, description: 'A team of explorers travel through a wormhole in space.', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', director: 'Christopher Nolan', vote_average: 8.6 },
    ]);

    const watch2 = useQuery({
        queryKey: ['watchlist', user?.user],
        queryFn: async () => {
            if (!user?.user) {
                throw new Error('No user ID available');
            }
            const { data } = await axios.get(`http://127.0.0.1:8000/imdb/watchlist/?user=${user.user}`);
            return data;
        },
        enabled: !!user?.user,
    });

    console.log(watch2);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Dummy recommended movies (replace with real data if available)
    const recommended_movie_list = [
        {
            title: 'Blade Runner 2049',
            poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
            director: 'Denis Villeneuve',
            vote_average: 8.0,
        },
        {
            title: 'Arrival',
            poster_path: '/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
            director: 'Denis Villeneuve',
            vote_average: 7.9,
        },
        {
            title: 'The Prestige',
            poster_path: '/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg',
            director: 'Christopher Nolan',
            vote_average: 8.5,
        },
    ];

    // Horizontal scroll for recommended movies
    const scrollRef = useRef(null);
    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <NavigationUI />
            <div className="flex flex-col items-center flex-1 w-full px-2">
                <h1 className="text-3xl font-extrabold text-yellow-400 mt-8 mb-4 drop-shadow text-center">
                    {user?.name ? `${user.name}'s Watchlist` : 'Your Watchlist'}
                </h1>
                <div className="w-full max-w-5xl h-[600px] flex flex-row items-stretch justify-center overflow-hidden relative">
                    {/* Watchlist Card - bigger */}
                    <div className="w-[420px] min-w-[320px] max-w-[500px] h-full bg-gray-800 rounded-l-2xl shadow-2xl border border-yellow-400/20 flex flex-col justify-center p-10 z-10 overflow-hidden">
                        <ul className="space-y-8">
                            {watchlist.map((movie) => (
                                <li
                                    key={movie.id}
                                    className={`flex items-center justify-between bg-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-600 transition shadow-lg border border-yellow-400/10 ${selectedMovie && selectedMovie.id === movie.id ? 'ring-2 ring-yellow-400' : ''
                                        }`}
                                    onClick={() => setSelectedMovie(movie)}
                                >
                                    <span className="text-white font-semibold text-xl drop-shadow">{movie.title}</span>
                                    {/* Rating Badge */}
                                    <span
                                        className={`ml-4 w-14 h-14 flex items-center justify-center rounded-full font-bold text-white text-xl shadow-lg border-4 border-yellow-400/30 ${getRatingColor(movie.rating)}`}
                                        aria-label={`Rating: ${movie.rating.toFixed(1)}`}
                                    >
                                        {movie.rating.toFixed(1)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Detail Card - bigger, fills remaining space */}
                    <AnimatePresence>
                        {selectedMovie && (
                            <motion.div
                                key="details"
                                initial={{ x: 500, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 500, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                                className="flex-1 h-full bg-gray-800 rounded-r-2xl shadow-2xl border border-yellow-400/20 flex flex-col items-center justify-center p-10 z-20 overflow-y-auto"
                                style={{ minWidth: 0 }}
                            >
                                <button
                                    className="absolute top-4 right-8 text-gray-400 hover:text-yellow-400 font-bold text-lg"
                                    onClick={() => setSelectedMovie(null)}
                                >
                                    &larr; Back
                                </button>
                                <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                                    <div className="w-56 h-80 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center shadow-lg border border-yellow-400/10">
                                        {selectedMovie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col items-center md:items-start">
                                        <h3 className="text-4xl font-extrabold text-yellow-400 mb-4 drop-shadow text-center md:text-left">
                                            {selectedMovie.title}
                                        </h3>
                                        <div
                                            className={`mb-6 w-20 h-20 flex items-center justify-center rounded-full font-bold text-white text-3xl shadow-lg border-4 border-yellow-400/30 ${getRatingColor(selectedMovie.rating)}`}
                                            aria-label={`Rating: ${selectedMovie.rating.toFixed(1)}`}
                                        >
                                            {selectedMovie.rating.toFixed(1)}
                                        </div>
                                        <p className="text-gray-300 mb-3 text-xl">
                                            Year:{' '}
                                            <span className="text-yellow-300 font-semibold">{selectedMovie.year}</span>
                                        </p>
                                        <p className="text-gray-400 mb-6 text-lg">{selectedMovie.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* User also liked - separate card, only when detail is open */}
                {selectedMovie && Array.isArray(recommended_movie_list) && recommended_movie_list.length > 0 && (
                    <motion.section
                        key="user-also-liked"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                        className="w-full max-w-5xl mt-8 bg-gray-900 rounded-2xl shadow-xl border border-yellow-400/20 p-8 relative"
                    >
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4 ml-2">Users also liked...</h2>
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900 bg-opacity-60 hover:bg-opacity-80 text-yellow-400 rounded-full p-2"
                            onClick={() => scroll('left')}
                        >
                            &#8592;
                        </button>
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900 bg-opacity-60 hover:bg-opacity-80 text-yellow-400 rounded-full p-2"
                            onClick={() => scroll('right')}
                        >
                            &#8594;
                        </button>
                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto space-x-8 pb-2 scrollbar-thin scrollbar-thumb-yellow-400/40 scrollbar-track-gray-800 scroll-smooth"
                        >
                            {recommended_movie_list.map((rec, idx) => (
                                <div
                                    key={rec.title + idx}
                                    className="min-w-[200px] bg-gray-800 rounded-xl shadow-lg border border-yellow-400/10 flex-shrink-0 p-5 hover:bg-gray-700 transition cursor-pointer flex flex-col items-center"
                                >
                                    <div className="w-32 h-48 bg-gray-700 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                                        {rec.poster_path?.trim() ? (
                                            <img
                                                src={rec.poster_path.startsWith('http') ? rec.poster_path : `https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                                                alt={rec.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        )}
                                    </div>
                                    <h3 className="text-yellow-200 font-semibold text-lg mb-1 text-center line-clamp-2">{rec.title}</h3>
                                    {rec.director && (
                                        <p className="text-xs text-gray-400 mb-1 text-center line-clamp-1">
                                            Director: {rec.director}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 text-yellow-300 font-semibold text-base justify-center">
                                        <svg className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.38-2.455c-.784-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                        </svg>
                                        {rec.vote_average}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
