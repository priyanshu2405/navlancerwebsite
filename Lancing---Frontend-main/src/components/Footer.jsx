import React from 'react';
import { Facebook, Linkedin, Twitter, Youtube, Instagram, Apple, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const sections = [
        {
            title: "For Clients",
            links: [
                "How to hire",
                "Talent Marketplace",
                "Project Catalog",
                "Hire an agency",
                "Enterprise",
                "Business Plus",
                "Any Hire",
                "Contract-to-hire",
                "Direct Contracts",
                "Hire worldwide",
                "Hire in the USA"
            ]
        },
        {
            title: "For Talent",
            links: [
                "How to find work",
                "Direct Contracts",
                "Find freelance jobs worldwide",
                "Find freelance jobs in the USA",
                "Win work with ads",
                "Exclusive resources with Freelancer Plus"
            ]
        },
        {
            title: "Resources",
            links: [
                "Help & support",
                "Success stories",
                "Navlancer reviews",
                "Resources",
                "Blog",
                "Affiliate programme",
                "Free Business Tools",
                "Release notes"
            ]
        },
        {
            title: "Company",
            links: [
                "About us",
                "Leadership",
                "Investor relations",
                "Careers",
                "Our impact",
                "Press",
                "Contact us",
                "Partners",
                "Trust, safety & security",
                "Modern slavery statement"
            ]
        }
    ];

    return (
        <footer className="bg-[#000000] text-white pt-16 pb-8 border-t border-white/10 rounded-t-[30px] mx-2 mt-4">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-16">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h4 className="text-gray-300 font-medium mb-4">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link to="#" className="text-sm text-gray-400 hover:text-primary hover:underline transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Socials & App */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-8 mb-8">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Follow us</span>
                        <div className="flex gap-3">
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Linkedin size={18} /></a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Youtube size={18} /></a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Mobile app</span>
                        <div className="flex gap-3">
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Apple size={18} /></a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><Smartphone size={18} /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center md:text-left text-sm text-gray-500 mb-8">
                    <p>© 2015 - 2026 Navlancer® Global Inc.</p>
                </div>



            </div>
        </footer>
    );
};

export default Footer;
