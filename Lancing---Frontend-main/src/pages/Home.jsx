import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';

const Home = () => {
    return (
        <>
            <Hero />
            <Services />
            <HowItWorks />
            <Pricing />
            <Reviews />
            <FAQ />
        </>
    );
};

export default Home;
