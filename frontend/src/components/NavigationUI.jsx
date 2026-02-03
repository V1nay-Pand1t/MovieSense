// Create a navigation bar component that can be used across the application.

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { useTheme } from './ThemeProvider';
import AnimatedLogo from './AnimatedLogo';

export default function NavigationUI() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="w-full flex justify-center mt-4">
            <div className="flex gap-6 flex-wrap justify-center items-center">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/">
                        <AnimatedLogo size="medium" variant="full" />
                    </Link>
                </motion.div>

                {/* Navigation Links Card */}
                <div className="bg-card rounded-xl shadow-lg px-8 py-3 flex items-center relative border border-border">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-accent md:hidden focus:outline-none mr-2"
                        aria-label="Toggle navigation"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <div className="hidden md:flex gap-8 mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="flex gap-8"
                        >
                            <motion.div
                                whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg px-3 py-1"
                            >
                                <Link to="/" className="text-foreground hover:text-accent transition">Home</Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg px-3 py-1"
                            >
                                <Link to="/explore" className="text-foreground hover:text-accent transition">Explore</Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg px-3 py-1"
                            >
                                <Link to="/about" className="text-foreground hover:text-accent transition">About</Link>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Mobile menu for Home & About & Explore */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-14 left-0 w-full bg-card z-50 flex flex-col items-center gap-4 py-4 md:hidden shadow rounded-xl border border-border"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="rounded-lg px-3 py-1 w-full text-center"
                                >
                                    <Link to="/" className="text-foreground hover:text-accent transition py-1 block" onClick={() => setIsOpen(false)}>Home</Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="rounded-lg px-3 py-1 w-full text-center"
                                >
                                    <Link to="/explore" className="text-foreground hover:text-accent transition py-1 block" onClick={() => setIsOpen(false)}>Explore</Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="rounded-lg px-3 py-1 w-full text-center"
                                >
                                    <Link to="/about" className="text-foreground hover:text-accent transition py-1 block" onClick={() => setIsOpen(false)}>About</Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme Toggle & Login Card */}
                <div className="bg-card rounded-xl shadow-lg px-6 py-3 flex items-center gap-3 border border-border">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-muted transition"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-accent" />
                        ) : (
                            <Moon className="w-5 h-5 text-accent" />
                        )}
                    </motion.button>
                    <motion.div
                        whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--accent))", color: "#1f2937" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="rounded-lg px-3 py-1"
                    >
                        <Link to="/login" className="text-foreground hover:text-accent transition">Login</Link>
                    </motion.div>
                </div>
            </div>
        </nav >
    );
}

