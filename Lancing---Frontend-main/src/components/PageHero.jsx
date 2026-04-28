import React from 'react';
import SearchBar from './SearchBar';

const PageHero = ({
    title,
    highlight,
    description,
    searchPlaceholder = "Search...",
    illustration = null
}) => {
    return (
        <div className="w-full pt-[40px] md:pt-[60px] pb-12">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Content */}
                <div className="space-y-8 flex flex-col items-start text-left">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-main leading-[1.1]">
                            {title} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-emerald-500">
                                {highlight}
                            </span>
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    <div className="w-full max-w-xl">
                        <SearchBar placeholder={searchPlaceholder} />
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="relative w-full h-[400px] md:h-[500px] bg-transparent flex items-center justify-center overflow-visible">
                    {illustration ? (
                        illustration
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                            <span className="text-slate-300 font-bold text-3xl">Illustration</span>
                        </div>
                    )}
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                </div>

            </div>
        </div>
    );
};

export default PageHero;
