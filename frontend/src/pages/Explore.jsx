import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationUI from '../components/NavigationUI';
import MovieCard from '../components/MovieCard';
import { useMoviesExplore } from '../hooks/useMoviesExplore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ALPHABET = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const PAGE_SIZE = 20;

export default function Explore() {
    const [selectedLetter, setSelectedLetter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { data: exploreData, isLoading, error } = useMoviesExplore(
        currentPage,
        PAGE_SIZE,
        selectedLetter
    );

    const results = exploreData?.results || [];
    const totalPages = exploreData?.total_pages || 0;
    const totalCount = exploreData?.count || 0;

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMovieClick = (movie) => {
        navigate(`/movie/${movie.id}`, { state: movie });
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
            {/* Navigation */}
            <NavigationUI />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 px-4 text-center border-b border-border bg-card/50"
            >
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent mb-2">
                    Explore All Movies
                </h1>
                <p className="text-muted-foreground text-lg">
                    Browse {totalCount.toLocaleString()} movies alphabetically
                </p>
            </motion.div>

            {/* Alphabet Filter */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-20 z-40 bg-card/90 backdrop-blur-md border-b border-border px-4 py-4"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {ALPHABET.map((letter) => (
                            <motion.button
                                key={letter}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLetterClick(letter)}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedLetter === letter
                                        ? 'bg-accent text-accent-foreground shadow-lg'
                                        : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                            >
                                {letter}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent animate-spin mr-3" />
                            <span className="text-muted-foreground text-lg">Loading movies...</span>
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
                                Error loading movies. Please try again.
                            </p>
                        </motion.div>
                    )}

                    {/* Movies Grid */}
                    {!isLoading && results.length > 0 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12"
                        >
                            {results.map((movie) => (
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

                    {/* Empty State */}
                    {!isLoading && results.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 text-center"
                        >
                            <p className="text-muted-foreground text-lg">
                                No movies found for "{selectedLetter}". Try another letter.
                            </p>
                        </motion.div>
                    )}

                    {/* Pagination Info */}
                    {!isLoading && results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-sm text-muted-foreground mb-6"
                        >
                            Showing page {currentPage} of {totalPages} ({results.length} movies)
                        </motion.div>
                    )}

                    {/* Pagination Controls */}
                    {!isLoading && totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <Button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                variant={currentPage === 1 ? "outline" : "default"}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <motion.button
                                            key={pageNum}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === pageNum
                                                    ? 'bg-accent text-accent-foreground shadow-lg'
                                                    : 'bg-muted hover:bg-muted/80 text-foreground'
                                                }`}
                                        >
                                            {pageNum}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                variant={currentPage === totalPages ? "outline" : "default"}
                                className="flex items-center gap-2"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
