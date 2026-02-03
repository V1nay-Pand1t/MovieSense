// Modern Home page with hero section, scroll-reveal search, and dynamic results positioning
import MovieSearchTabs from '../components/MovieTabs';
import NavigationUI from '../components/NavigationUI';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Film, Zap, Check } from 'lucide-react';
import { useMoviesSearch } from '../hooks/useMoviesSearch';
import { useDebounce } from 'use-debounce';

export default function Home() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('normal');
    const [debouncedQuery] = useDebounce(searchQuery, 700);

    // Scroll detection for search bar reveal
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.3], [0, 50]);

    // Get search results
    const { data: results = [] } = useMoviesSearch(debouncedQuery, searchMode);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const whyMovieSenseFeatures = [
        { icon: Sparkles, title: "Smart Search", desc: "Full-text & semantic search", color: "from-accent" },
        { icon: Zap, title: "Lightning Fast", desc: "Instant results & recommendations", color: "from-yellow-500" },
        { icon: Film, title: "Curated Picks", desc: "AI-powered recommendations", color: "from-orange-500" },
        { icon: Check, title: "Always Learning", desc: "Improves with your preferences", color: "from-purple-500" },
    ];

    return (
        <div ref={ref} className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background">
            {/* Navigation */}
            <NavigationUI />

            {/* Hero Section - Why MovieSense */}
            <motion.div
                style={{ opacity, scale, y }}
                className="flex-1 flex flex-col items-center justify-center px-4 py-20"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center space-y-12 max-w-3xl"
                >
                    {/* Main Hero Title */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent via-accent to-accent bg-clip-text text-transparent">
                                Why MovieSense?
                            </h1>
                            <Film className="w-8 h-8 text-accent animate-pulse" />
                        </div>
                        <p className="text-xl md:text-2xl text-muted-foreground">
                            Discover movies like never before. Powered by intelligent search and AI-driven recommendations.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12"
                    >
                        {whyMovieSenseFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, y: -8 }}
                                className={`p-6 rounded-lg bg-gradient-to-br ${feature.color} to-transparent bg-opacity-10 border border-border shadow-lg hover:shadow-xl transition-all`}
                            >
                                <feature.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Text */}
                    <motion.div
                        variants={itemVariants}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-sm text-muted-foreground"
                    >
                        ↓ Scroll to search movies ↓
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Search Section - Reveals on Scroll */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="py-20 px-4 bg-card/50 border-t border-border"
            >
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl font-bold text-center mb-12"
                    >
                        Start Your Discovery
                    </motion.h2>

                    {/* Search Bar Container with Dynamic Sizing */}
                    <motion.div
                        layout
                        className="flex justify-center"
                    >
                        <div className="w-full max-w-2xl">
                            <MovieSearchTabs
                                onQueryChange={setSearchQuery}
                                onModeChange={setSearchMode}
                                resultsCount={results.length}
                            />
                        </div>
                    </motion.div>

                    {/* Results Counter with Dynamic Positioning */}
                    <motion.div
                        layout
                        className="flex justify-center mt-6"
                    >
                        {searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted-foreground"
                            >
                                Found <span className="font-semibold text-accent">{results.length}</span> movies
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-4 bg-background"
            >
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-4xl font-bold">Experience the Difference</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        MovieSense combines advanced search algorithms with AI recommendations to help you find your next favorite film in seconds. Whether you're into action, romance, or indie films, we've got you covered.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-8 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:shadow-lg transition-all"
                    >
                        Explore Now
                    </motion.button>
                </div>
            </motion.section>
        </div>
    );
}
