import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ placeholder = "Search for jobs..." }) => {
    return (
        <div className="flex items-center gap-4 w-full max-w-2xl bg-bg-card rounded-xl border border-border-dark p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-300">
            <div className="pl-3 text-text-muted">
                <Search size={20} />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none outline-none text-text-main placeholder:text-text-muted text-base h-10 w-full"
            />
            <button className="p-2 text-text-muted hover:text-text-main hover:bg-white/10 rounded-lg transition-colors">
                <SlidersHorizontal size={20} />
            </button>
            <button className="bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Search
            </button>
        </div>
    );
};

export default SearchBar;
