import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, Sparkles } from 'lucide-react';

const AnimatedLogo = ({ size = 'large', variant = 'full' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        small: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-lg' },
        medium: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xl' },
        large: { container: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-2xl' },
        xl: { container: 'w-32 h-32', icon: 'w-12 h-12', text: 'text-3xl' }
    };

    const sizes = sizeClasses[size];

    // Rotating orbit animation
    const orbitVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    // Floating particles
    const particleVariants = {
        animate: (i) => ({
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 1, 0.3],
            transition: {
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        })
    };

    // Pulsing glow
    const glowVariants = {
        initial: { scale: 1, opacity: 0.5 },
        hover: { scale: 1.2, opacity: 0.8 },
        animate: {
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
            transition: {
                duration: 3,
                repeat: Infinity
            }
        }
    };

    // Icon bounce
    const iconVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.15,
            rotate: 360,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    // Sparkle burst
    const sparkleVariants = {
        initial: { scale: 0, opacity: 0 },
        hover: (i) => ({
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.cos((i / 4) * Math.PI * 2) * 30,
            y: Math.sin((i / 4) * Math.PI * 2) * 30,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Main Logo Container */}
            <motion.div
                className={`${sizes.container} relative cursor-pointer`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.08 }}
            >
                {/* Outer Glow Background */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 via-accent/20 to-transparent"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    style={{ filter: 'blur(12px)' }}
                />

                {/* Secondary Glow on Hover */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-l from-accent/40 to-transparent"
                    animate={isHovered ? { scale: 1.3, opacity: 0.5 } : { scale: 1, opacity: 0 }}
                    style={{ filter: 'blur(16px)' }}
                />

                {/* Main Circle Background */}
                <motion.div
                    className={`${sizes.container} absolute inset-0 rounded-full bg-gradient-to-br from-card via-card to-muted border-2 border-accent/40 shadow-2xl overflow-hidden`}
                    animate={isHovered ? { borderColor: 'hsl(var(--accent))' } : { borderColor: 'hsl(var(--accent) / 0.4)' }}
                >
                    {/* Inner Gradient Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent/5"
                        animate={isHovered ? { opacity: 0.8 } : { opacity: 0.4 }}
                    />

                    {/* Orbiting Particles */}
                    <motion.div
                        className="absolute inset-0"
                        variants={orbitVariants}
                        animate="animate"
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-accent rounded-full"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-2px',
                                    marginLeft: '-2px',
                                }}
                                animate={{
                                    x: Math.cos((i / 4) * Math.PI * 2) * (size === 'large' ? 35 : size === 'medium' ? 25 : 15),
                                    y: Math.sin((i / 4) * Math.PI * 2) * (size === 'large' ? 35 : size === 'medium' ? 25 : 15),
                                }}
                                transition={{ duration: 0.1 }}
                            />
                        ))}
                    </motion.div>

                    {/* Center Icon */}
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center z-10"
                        variants={iconVariants}
                        animate={isHovered ? "hover" : "initial"}
                    >
                        <Clapperboard className={`${sizes.icon} text-accent`} />
                    </motion.div>

                    {/* Hover Sparkles */}
                    {isHovered && [0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={`sparkle-${i}`}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            variants={sparkleVariants}
                            initial="initial"
                            animate="hover"
                            custom={i}
                        >
                            <Sparkles className="w-3 h-3 text-accent" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Border Glow Ring */}
                <motion.div
                    className={`${sizes.container} absolute inset-0 rounded-full border-2 border-transparent`}
                    animate={isHovered ? {
                        borderColor: 'hsl(var(--accent) / 0.8)',
                        boxShadow: '0 0 30px hsl(var(--accent) / 0.5)'
                    } : {
                        borderColor: 'hsl(var(--accent) / 0.2)',
                        boxShadow: '0 0 10px hsl(var(--accent) / 0.2)'
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Brand Text */}
            {variant === 'full' && (
                <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className={`${sizes.text} font-bold bg-gradient-to-r from-accent via-accent to-accent bg-clip-text text-transparent`}
                        animate={isHovered ? { letterSpacing: '0.05em' } : { letterSpacing: '0em' }}
                    >
                        MovieSense
                    </motion.h1>
                    <motion.p
                        className={`${size === 'small' ? 'text-xs' : 'text-sm'} text-muted-foreground font-medium tracking-wide`}
                        animate={isHovered ? { opacity: 0.8 } : { opacity: 0.6 }}
                    >
                        AI Movie Recommender
                    </motion.p>
                </motion.div>
            )}
        </div>
    );
};

export default AnimatedLogo;
