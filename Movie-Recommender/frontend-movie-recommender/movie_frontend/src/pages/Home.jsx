// Example: Home page
import AnimatedLogo from '../components/AnimatedLogo';
import MovieSearchTabs from '../components/MovieTabs';
import NavigationUI from '../components/NavigationUI';
import React from 'react';


export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <NavigationUI />
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="mb-4 scale-150">
                    <AnimatedLogo />
                </div>
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-2xl scale-125">
                        <MovieSearchTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}
