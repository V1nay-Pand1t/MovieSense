// Example: Search bar component
export default function SearchBar({ value, onChange, onSearch, placeholder }) {
    return (
        <div className="relative flex justify-center w-full">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Search...'}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 transform focus:scale-105 mx-auto"
            />
            <button
                className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
                onClick={onSearch}
                aria-label="Search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                </svg>
            </button>
        </div>
    );
}
