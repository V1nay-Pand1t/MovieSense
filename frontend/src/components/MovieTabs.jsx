import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useMoviesSearch } from '../hooks/useMoviesSearch';
import { useDebounce } from 'use-debounce';
import { Search, Lightbulb, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/Badge';

export default function MovieSearchTabs({ onQueryChange, onModeChange, resultsCount = 0 }) {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('normal');
    const [showResults, setShowResults] = useState(false);
    const [debouncedQuery] = useDebounce(query, 700);
    const navigate = useNavigate();

    // Always call the hook, pass mode and debouncedQuery
    const {
        data: results = [],
        isLoading,
        error
    } = useMoviesSearch(debouncedQuery, mode);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onQueryChange?.(value);
        setShowResults(value.length > 0);
    };

    const handleTabChange = (index) => {
        const newMode = index === 0 ? 'normal' : 'semantic';
        setMode(newMode);
        onModeChange?.(newMode);
        setQuery('');
        onQueryChange?.('');
    };

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    // Calculate if results expand or compress the search bar
    const hasResults = results.length > 0;
    const maxResultsHeight = Math.min(results.length * 80, 320); // ~80px per result, max 320px

    return (
        <motion.div
            className="w-full max-w-2xl mx-auto"
            layout
        >
            <Tab.Group onChange={handleTabChange}>
                <Tab.List className="flex space-x-1 rounded-lg bg-muted p-1 mb-4 border border-border">
                    {[{
                        label: 'Normal Search',
                        icon: Search
                    }, {
                        label: 'Semantic Search',
                        icon: Lightbulb
                    }
                    ].map(({ label, icon: Icon }, idx) => (
                        <Tab
                            key={label}
                            className={({ selected }) =>
                                `flex-1 py-2.5 px-3 text-sm leading-5 font-medium rounded-md transition-all ${selected ? 'bg-accent text-accent-foreground shadow-md' : 'text-muted-foreground hover:bg-muted-foreground/10'}`
                            }
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </div>
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {[{ type: 'normal' }, { type: 'semantic' }].map((_, panelIdx) => (
                        <Tab.Panel key={panelIdx}>
                            <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-4">
                                <div className="relative flex justify-center">
                                    <input
                                        type="text"
                                        value={mode === (panelIdx === 0 ? 'normal' : 'semantic') ? query : ''}
                                        onChange={handleInputChange}
                                        placeholder={`Search for movies (${panelIdx === 0 ? 'normal' : 'semantic'} mode)`}
                                        className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background placeholder:text-muted-foreground transition-all"
                                    />
                                </div>

                                {isLoading && (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-5 h-5 text-accent animate-spin mr-2" />
                                        <span className="text-muted-foreground">Loading...</span>
                                    </div>
                                )}
                                {error && <p className="text-destructive mt-4 text-sm">Error: {error.message}</p>}

                                {/* Results Container - Expands/Contracts Based on Count */}
                                <AnimatePresence>
                                    {results.length > 0 && (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-3"
                                        >
                                            {/* Results Header */}
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-sm font-semibold text-foreground">
                                                    Found {results.length} movie{results.length !== 1 ? 's' : ''}
                                                </span>
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            </div>

                                            {/* Scrollable Results List */}
                                            <motion.ul
                                                className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
                                                initial="hidden"
                                                animate="visible"
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: {
                                                        opacity: 1,
                                                        transition: { staggerChildren: 0.05 }
                                                    }
                                                }}
                                            >
                                                {results.map((movie, idx) => (
                                                    <motion.li
                                                        key={movie.id}
                                                        variants={{
                                                            hidden: { opacity: 0, x: -20 },
                                                            visible: { opacity: 1, x: 0 }
                                                        }}
                                                        whileHover={{ scale: 1.02, x: 5 }}
                                                        className="bg-card p-3 rounded-lg cursor-pointer hover:bg-card/80 hover:shadow-md transition border border-border flex items-center gap-4"
                                                        onClick={() => navigate(`/movie/${movie.id}`, { state: movie })}
                                                    >
                                                        {/* Poster */}
                                                        <div className="w-12 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                                            {movie.poster_path ? (
                                                                <img
                                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                                    alt={movie.title}
                                                                    className="w-full h-full object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs">No Image</span>
                                                            )}
                                                        </div>
                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-semibold text-foreground truncate">{movie.title}</h3>
                                                            <p className="text-muted-foreground text-xs">{movie.genres || 'N/A'}</p>
                                                            {movie.rating && (
                                                                <Badge variant="secondary" className="mt-1 text-xs">
                                                                    ★ {movie.rating}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isLoading && results.length === 0 && query && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No movies found. Try a different search term.</p>
                                    </div>
                                )}
                            </motion.div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </motion.div>
    )
}
