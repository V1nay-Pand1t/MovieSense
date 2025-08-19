// Create a navigation bar component that can be used across the application.

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationUI() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full flex justify-center mt-4">
            <div className="flex gap-6">
                {/* Card 1: Home & About */}
                <div className="bg-gray-900 rounded-xl shadow-lg px-8 py-3 flex items-center relative min-w-[220px]">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-yellow-400 md:hidden focus:outline-none mr-2"
                        aria-label="Toggle navigation"
                    >
                        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                    <div className="hidden md:flex gap-8 mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="flex gap-8"
                        >
                            <motion.div
                                whileHover={{ scale: 1.12, backgroundColor: "#fde68a", color: "#1f2937" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg px-3 py-1"
                            >
                                <Link to="/" className="text-white hover:text-yellow-400 transition">Home</Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.12, backgroundColor: "#fde68a", color: "#1f2937" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-lg px-3 py-1"
                            >
                                <Link to="/about" className="text-white hover:text-yellow-400 transition">About</Link>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Mobile menu for Home & About */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-14 left-0 w-full bg-gray-900 z-50 flex flex-col items-center gap-4 py-4 md:hidden shadow rounded-xl"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.12, backgroundColor: "#fde68a", color: "#1f2937" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="rounded-lg px-3 py-1 w-full text-center"
                                >
                                    <Link to="/" className="text-white hover:text-yellow-400 transition py-1 block" onClick={() => setIsOpen(false)}>Home</Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.12, backgroundColor: "#fde68a", color: "#1f2937" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="rounded-lg px-3 py-1 w-full text-center"
                                >
                                    <Link to="/about" className="text-white hover:text-yellow-400 transition py-1 block" onClick={() => setIsOpen(false)}>About</Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* Card 2: Login */}
                <div className="bg-gray-900 rounded-xl shadow-lg px-6 py-3 flex items-center min-w-[100px] justify-center">
                    <motion.div
                        whileHover={{ scale: 1.12, backgroundColor: "#fde68a", color: "#1f2937" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="rounded-lg px-3 py-1"
                    >
                        <Link to="/login" className="text-white hover:text-yellow-400 transition">Login</Link>
                    </motion.div>
                </div>
            </div>
        </nav >
    );
}

