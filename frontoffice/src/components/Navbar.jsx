import React, { useState, useEffect } from 'react';
import { BACK_URL } from "../config.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faStore } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ logo }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnchorClick = (anchor) => {
        setMobileMenuOpen(false);
        if (window.location.pathname !== "/") {
            navigate(`/?scrollTo=${anchor}`);
        } else {
            const element = document.getElementById(anchor);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navLinks = [
        { label: "Fonctionnement", action: () => handleAnchorClick('section-fonction') },
        { label: "Ambition", action: () => handleAnchorClick('section-ambition') },
        { label: "Intérêts", action: () => handleAnchorClick('section-interets') },
        { label: "Partenaires", action: () => handleAnchorClick('section-partenaire') },
        { label: "Aperçu boutique", action: () => handleAnchorClick('section-boutique') },
        { label: "Contact", action: () => handleAnchorClick('section-contact') },
    ];

    const getLogoSrc = (input) => {
        if (!input) return null;
        try {
            if (typeof input === 'string' && input.trim().startsWith('{')) {
                const parsed = JSON.parse(input);
                return parsed.src || parsed.url || input;
            }
            if (typeof input === 'object') {
                return input.src || input.url;
            }
        } catch (e) {
            return input;
        }
        return input;
    }

    const logoSrc = getLogoSrc(logo);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <button onClick={() => handleAnchorClick('section-header')} className="flex items-center gap-2 group">
                    {(logoSrc && logoSrc.startsWith('data:')) ? (
                        <img src={logoSrc} className="h-10 w-auto transition-transform group-hover:scale-105" alt="IT-RECO" />
                    ) : (
                        <span className="text-2xl font-bold font-display text-slate-900">IT<span className="text-primary-600">RECO</span></span>
                    )}
                </button>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link, idx) => (
                        link.path ? (
                            <Link
                                key={idx}
                                to={link.path}
                                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors uppercase tracking-wide"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <button
                                key={idx}
                                onClick={link.action}
                                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors uppercase tracking-wide"
                            >
                                {link.label}
                            </button>
                        )
                    ))}
                    <Link to="/store" className="btn btn-ghost btn-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50">
                        <FontAwesomeIcon icon={faStore} className="mr-2" /> Boutique
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-slate-800 p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} size="lg" />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
                <div className="flex flex-col gap-6 text-center">
                    {navLinks.map((link, idx) => (
                        link.path ? (
                            <Link
                                key={idx}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-bold text-slate-800 hover:text-primary-600"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <button
                                key={idx}
                                onClick={link.action}
                                className="text-xl font-bold text-slate-800 hover:text-primary-600"
                            >
                                {link.label}
                            </button>
                        )
                    ))}
                </div>
            </div>
        </header >
    );
};

export default Navbar;