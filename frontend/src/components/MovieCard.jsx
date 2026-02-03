import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Share2 } from 'lucide-react';
import { Badge } from './ui/Badge';

export default function MovieCard({ movie, onClick }) {
    const handleShare = (e) => {
        e.stopPropagation();
        const movieUrl = `${window.location.origin}/movie/${movie.id}`;
        const text = `Check out "${movie.title}" on MovieSense! Rating: ${(movie.vote_average / 2).toFixed(1)}/5`;

        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: text,
                url: movieUrl,
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(`${text}\n${movieUrl}`);
            alert('Movie link copied to clipboard!');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            onClick={onClick}
            className="cursor-pointer rounded-lg overflow-hidden bg-card border border-border shadow-md hover:shadow-2xl transition-all group"
        >
            {/* Poster Image */}
            <div className="relative w-full h-48 bg-muted overflow-hidden group">
                {movie.poster_path ? (
                    <motion.img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span>No Image</span>
                    </div>
                )}

                {/* Share Button Overlay */}
                <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={handleShare}
                    className="absolute bottom-2 right-2 bg-accent/90 backdrop-blur-sm hover:bg-accent p-2 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Share movie"
                >
                    <Share2 className="w-4 h-4 text-accent-foreground" />
                </motion.button>

                {/* Rating Overlay */}
                {movie.vote_average && (
                    <div className="absolute top-2 right-2 bg-accent/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-accent-foreground" />
                        <span className="text-sm font-bold text-accent-foreground">
                            {(movie.vote_average / 2).toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-foreground line-clamp-2 hover:text-accent transition">
                    {movie.title}
                </h3>

                {/* Release Year */}
                {movie.release_date && (
                    <p className="text-xs text-muted-foreground">
                        {new Date(movie.release_date).getFullYear()}
                    </p>
                )}

                {/* Plot */}
                {movie.overview && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {movie.overview}
                    </p>
                )}

                {/* Actors/Cast */}
                {movie.cast && movie.cast.length > 0 && (
                    <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {movie.cast.slice(0, 3).join(', ')}
                        </p>
                    </div>
                )}

                {/* Genres */}
                {movie.genres && (
                    <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                                {genre}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
