import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from '../components/AnimatedLogo';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

export default function MovieDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const movie_data = location.state;
    const [isCastExpanded, setIsCastExpanded] = useState(false);

    const scrollRef = useRef(null);
    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    };


    const { data: movie, isLoading, isError } = useQuery({
        queryKey: ['movie', movie_data?.poster_path],
        queryFn: async () => {
            if (!movie_data?.poster_path) {
                throw new Error('No poster path available');
            }
            const { data } = await axios.get(`/imdb/movies/info/?q=${movie_data.poster_path}`);
            return data;
        },
        enabled: !!movie_data?.poster_path,
    });

    if (!movie_data) {
        return (
            <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <p className="text-yellow-400 text-xl">No movie data available</p>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <p className="text-yellow-400 text-xl">Loading movie info...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <p className="text-red-400 text-xl">Failed to load movie.</p>
            </section>
        );
    }

    if (!movie) {
        return (
            <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <p className="text-yellow-400 text-xl">Movie not found</p>
            </section>
        );
    }

    const posterSrc = movie_data.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie_data.poster_path}`
        : null;
    const recommended_movie_list = movie.similar_movies || [];

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } }
    };

    const genres = Array.isArray(movie.genres)
        ? movie.genres
        : typeof movie.genres === 'string'
            ? movie.genres.split(',').map(g => g.trim())
            : [];

    const castArray = Array.isArray(movie.cast)
        ? movie.cast
        : typeof movie.cast === 'string'
            ? movie.cast.split(',').map(c => c.trim())
            : [];


    const toggleCastExpansion = () => setIsCastExpanded(!isCastExpanded);

    const handleSave = async () => {
        console.log(`Movie "${movie.title}" saved for future watchlist feature.`);
        const response = await axios.post(`http://moviesense-backend:8080/imdb/movies/update_watchlist/?q=${movie_data.poster_path}`, movie_data, { withCredentials: true });
        setMessage(`Movie "${movie.title}" saved for future watchlist feature.`);
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                className="mb-6"
            >
                <AnimatedLogo />
            </motion.div>

            <section className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
                <motion.article
                    className={`flex-1 bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 border transition-transform hover:scale-[1.01] ${movie.academy_winner ? 'border-yellow-400' : 'border-yellow-400/20'}`}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                >
                    <motion.figure
                        className="flex-shrink-0 flex justify-center items-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                    >
                        {posterSrc ? (
                            <img
                                src={posterSrc}
                                alt={movie.title || 'Movie poster'}
                                className="rounded-xl shadow-lg w-56 sm:w-64 h-auto max-h-[28rem] object-cover border-4 border-yellow-400/30"
                            />
                        ) : (
                            <div className="w-56 sm:w-64 h-80 flex items-center justify-center bg-gray-700 rounded-xl text-yellow-400 text-xl font-bold">
                                No Poster
                            </div>
                        )}
                    </motion.figure>

                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow">
                                {movie.title || 'Unknown Title'}
                            </h1>

                            {movie.academy_winner && (
                                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
                                    Academy Award Winner
                                </span>
                            )}

                            {/* Release date, rating, IMDB, lets only keep the year */}

                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                {movie.release_date && (
                                    <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                                        {movie.release_date.split('-')[0]}
                                    </span>
                                )}
                                {typeof movie.vote_average === "number" && (
                                    <span
                                        className={`
            inline-flex items-center justify-center gap-1 px-2 py-1
            rounded-full font-semibold text-white text-sm
            ${movie.vote_average >= 8
                                                ? "bg-green-600"
                                                : movie.vote_average >= 7
                                                    ? "bg-yellow-500"
                                                    : movie.vote_average >= 5
                                                        ? "bg-orange-500"
                                                        : "bg-red-600"
                                            }
        `}
                                        aria-label={`Movie rating: ${movie.vote_average.toFixed(1)}`}
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.38-2.455c-.784-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                        </svg>
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                )}


                                {movie.imdb_id && (
                                    <span className="text-gray-400 text-xs ml-auto">
                                        IMDB: <span className="font-mono text-yellow-300">{movie.imdb_id}</span>
                                    </span>
                                )}
                            </div>

                            {/* Genres */}
                            {genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {genres.map((genre, idx) => (
                                        <span key={idx} className="bg-gray-700 text-yellow-200 px-2 py-1 rounded text-xs font-medium shadow">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tagline */}
                            {movie.tagline && (
                                <p className="text-yellow-300 italic mb-4">"{movie.tagline}"</p>
                            )}

                            {/* Overview */}
                            {movie.overview && (
                                <motion.p
                                    className="text-gray-100 text-lg mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    {movie.overview}
                                </motion.p>
                            )}

                            {/* Director */}
                            {movie.director && (
                                <p className="mt-4 text-gray-400 text-sm">
                                    Director: <span className="text-yellow-300">{movie.director}</span>
                                </p>
                            )}

                            {/* Cast */}
                            {movie.cast && (
                                <div className="mt-4">
                                    <span className="text-gray-400 text-sm">Cast: </span>
                                    <span className="text-yellow-300">
                                        {typeof movie.cast === 'string' ? movie.cast : castArray.join(', ')}
                                    </span>
                                    {castArray.length > 3 && (
                                        <button
                                            onClick={toggleCastExpansion}
                                            className="ml-2 text-blue-400 hover:text-blue-300 text-sm underline"
                                        >
                                            {isCastExpanded ? 'Show Less' : 'Show All'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {movie.popularity && (
                                <p className="mt-2 text-gray-400 text-sm">
                                    Popularity: <span className="text-yellow-300">{movie.popularity}</span>
                                </p>
                            )}

                            {/* Expanded Cast */}
                            <AnimatePresence>
                                {isCastExpanded && castArray.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-2 overflow-hidden"
                                    >
                                        {castArray.map((actor, index) => (
                                            <span key={index} className="inline-block bg-gray-700 text-yellow-200 px-2 py-1 rounded text-xs font-medium shadow mr-2 mb-2">
                                                {actor}
                                            </span>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Save to Watchlist Button */}
                            <button
                                onClick={handleSave}
                                className="mt-6 px-5 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition"
                                aria-label={`Save ${movie.title} to watchlist`}
                            >
                                Save to Watchlist
                            </button>
                        </div>
                    </div>
                </motion.article>
            </section>

            {/* Recommended Movies */}
            {Array.isArray(recommended_movie_list) && recommended_movie_list.length > 0 && (
                <section className="w-full max-w-7xl mt-10 relative">
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
                        className="flex overflow-x-auto space-x-6 pb-2 scrollbar-thin scrollbar-thumb-yellow-400/40 scrollbar-track-gray-800 scroll-smooth"
                    >
                        {recommended_movie_list.map((rec, idx) => (
                            <div
                                key={rec.title + idx}
                                className="min-w-[220px] bg-gray-800 rounded-xl shadow-lg border border-yellow-400/10 flex-shrink-0 p-4 hover:bg-gray-700 transition cursor-pointer flex flex-col items-center"
                                onClick={() => navigate(`/movie/${rec.title}`, { state: rec })}
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
                                <h3 className="text-yellow-200 font-semibold text-base mb-1 text-center line-clamp-2">{rec.title}</h3>
                                {rec.director && (
                                    <p className="text-xs text-gray-400 mb-1 text-center line-clamp-1">
                                        Director: {rec.director}
                                    </p>
                                )}
                                <div className="flex items-center gap-1 text-yellow-300 font-semibold text-sm justify-center">
                                    <svg className="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.38-2.455c-.784-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                    {rec.vote_average}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
