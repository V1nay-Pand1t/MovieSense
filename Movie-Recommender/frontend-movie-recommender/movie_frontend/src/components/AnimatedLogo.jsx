import React, { useState, useEffect } from 'react';
import { Film, Star, Play, Zap } from 'lucide-react';

const AnimatedLogo = ({ size = 'large', variant = 'full' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [glowEffect, setGlowEffect] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlowEffect(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-16 h-16',
        large: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const textSizes = {
        small: 'text-lg',
        medium: 'text-xl',
        large: 'text-2xl',
        xl: 'text-3xl'
    };

    return (
        <div className="flex items-center space-x-3">
            {/* Animated Logo Icon */}
            <div
                className={`relative ${sizeClasses[size]} cursor-pointer transition-all duration-500 transform ${isHovered ? 'scale-110' : 'scale-100'
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Outer Glow Ring */}
                <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${glowEffect ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-30 scale-125' : 'opacity-0 scale-100'
                        }`}
                    style={{
                        filter: 'blur(8px)',
                        animation: glowEffect ? 'pulse 2s infinite' : 'none'
                    }}
                />

                {/* Main Logo Container */}
                <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-400 flex items-center justify-center shadow-2xl overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-red-500/10" />

                    {/* Rotating Film Strip */}
                    <div
                        className="absolute inset-2 border border-yellow-400/30 rounded-full"
                        style={{
                            animation: isHovered ? 'spin 3s linear infinite' : 'spin 8s linear infinite'
                        }}
                    >
                        {/* Film perforations */}
                        <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute right-0 top-1/2 w-1 h-1 bg-yellow-400/50 rounded-full transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400/50 rounded-full transform -translate-x-1/2 translate-y-1/2" />
                        <div className="absolute left-0 top-1/2 w-1 h-1 bg-yellow-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    {/* Center Icons */}
                    <div className="relative z-10 flex items-center justify-center">
                        {/* Main Film Icon */}
                        <Film
                            className={`${size === 'small' ? 'w-6 h-6' : size === 'medium' ? 'w-8 h-8' : size === 'large' ? 'w-10 h-10' : 'w-12 h-12'} text-yellow-400 transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                                }`}
                        />

                        {/* Floating Stars */}
                        <Star
                            className={`absolute ${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-300 transform transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                }`}
                            style={{
                                top: '10%',
                                right: '15%',
                                animation: isHovered ? 'float 2s ease-in-out infinite' : 'none'
                            }}
                        />
                        <Star
                            className={`absolute ${size === 'small' ? 'w-2 h-2' : 'w-3 h-3'} text-red-400 transform transition-all duration-700 ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                }`}
                            style={{
                                bottom: '20%',
                                left: '10%',
                                animation: isHovered ? 'float 2.5s ease-in-out infinite reverse' : 'none'
                            }}
                        />

                        {/* Play Button Overlay */}
                        <div
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Play className={`${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-6 h-6'} text-white/80 transform scale-75`} />
                        </div>
                    </div>

                    {/* Lightning Effect */}
                    <Zap
                        className={`absolute top-1 right-1 ${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-300 transform transition-all duration-200 ${glowEffect ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                            }`}
                        style={{
                            animation: glowEffect ? 'flash 0.5s ease-in-out' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* App Name */}
            {variant === 'full' && (
                <div className="flex flex-col">
                    <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent`}>
                        MovieSense
                    </h1>
                    <p className={`${size === 'small' ? 'text-xs' : 'text-sm'} text-gray-400 font-medium tracking-wide`}>
                        AI Movie Recommender
                    </p>
                </div>
            )}

            {/* Custom Keyframes Styles */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1.1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
};

export default AnimatedLogo;
