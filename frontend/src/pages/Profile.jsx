import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import NavigationUI from '../components/NavigationUI';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { Share2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useUser();
    const navigate = useNavigate();

    // Dummy watchlist (replace with real data from API)
    const [watchlist] = useState([
        { id: 1, title: 'Inception', rating: 8.8, year: 2010, overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.', poster_path: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg', director: 'Christopher Nolan', vote_average: 8.8, release_date: '2010-07-16' },
        { id: 2, title: 'The Matrix', rating: 8.7, year: 1999, overview: 'A computer hacker learns about the true nature of his reality.', poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', director: 'Lana Wachowski', vote_average: 8.7, release_date: '1999-03-31' },
        { id: 3, title: 'Interstellar', rating: 8.6, year: 2014, overview: 'A team of explorers travel through a wormhole in space.', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', director: 'Christopher Nolan', vote_average: 8.6, release_date: '2014-11-07' },
    ]);

    const isLoading = false;
    const error = null;

    const handleMovieClick = (movie) => {
        navigate(`/movie/${movie.id}`, { state: movie });
    };

    const handleShare = async () => {
        const watchlistUrl = `${window.location.origin}/profile`;
        const text = `Check out my watchlist on MovieSense! ${watchlist.length} movies saved.`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My MovieSense Watchlist',
                    text: text,
                    url: watchlistUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(`${text}\n${watchlistUrl}`);
            alert('Watchlist link copied to clipboard!');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background">
            <NavigationUI />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 px-4 text-center border-b border-border bg-card/50"
            >
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
                        {user?.name ? `${user.name}'s Watchlist` : 'Your Watchlist'}
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Share</span>
                    </motion.button>
                </div>
                <p className="text-muted-foreground text-lg mt-2">
                    {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
                </p>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent animate-spin mr-3" />
                            <span className="text-muted-foreground text-lg">Loading watchlist...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 text-center"
                        >
                            <p className="text-destructive text-lg">
                                Error loading watchlist. Please try again.
                            </p>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!isLoading && watchlist.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 text-center"
                        >
                            <p className="text-muted-foreground text-lg mb-4">
                                Your watchlist is empty
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/explore')}
                                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
                            >
                                Browse Movies
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Movies Grid */}
                    {!isLoading && watchlist.length > 0 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                        >
                            {watchlist.map((movie) => (
                                <motion.div
                                    key={movie.id}
                                    variants={itemVariants}
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
