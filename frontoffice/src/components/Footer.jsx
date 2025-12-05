import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { BACK_URL } from "../config.js";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import MentionsLegales from "../pages/MentionsLegales.jsx";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = ({ logo, contact, linkedin, siret }) => {
    const navigate = useNavigate()

    const handleAnchorClick = (anchor) => {
        if (window.location.pathname !== "/") {
            navigate(`/?scrollTo=${anchor}`);
        } else {
            const element = document.getElementById(anchor);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    }

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
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        {(logoSrc && logoSrc.startsWith('data:')) ? (
                            <img src={logoSrc} alt="IT-RECO" className="h-12 w-auto mb-6" />
                        ) : (
                            <span className="text-2xl font-bold font-display text-slate-900 mb-6 block">IT<span className="text-primary-600">RECO</span></span>
                        )}
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Expert du réemploi informatique dans la Métropole Lilloise.
                            Donnez une seconde vie à votre matériel professionnel.
                        </p>
                    </div>

                    <div>
                        <h6 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Navigation</h6>
                        <ul className="space-y-3">
                            <li><button onClick={() => handleAnchorClick('section-fonction')} className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Fonctionnement</button></li>
                            <li><button onClick={() => handleAnchorClick('section-ambition')} className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Ambition</button></li>
                            <li><button onClick={() => handleAnchorClick('section-interets')} className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Intérêts</button></li>
                            <li><button onClick={() => handleAnchorClick('section-partenaire')} className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Partenaires</button></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Liens Utiles</h6>
                        <ul className="space-y-3">
                            <li><Link to="/store" className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Boutique en ligne</Link></li>
                            <li><button onClick={() => handleAnchorClick('section-contact')} className="text-slate-600 hover:text-primary-600 transition-colors text-sm">Contact</button></li>
                            <li><MentionsLegales /></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Contact</h6>
                        {contact && (
                            <a href={`mailto:${contact}`} className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors mb-4 group">
                                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faEnvelope} size="sm" />
                                </div>
                                <span className="text-sm">{contact}</span>
                            </a>
                        )}
                        {linkedin && (
                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faLinkedin} size="sm" />
                                </div>
                                <span className="text-sm">LinkedIn</span>
                            </a>
                        )}
                        {siret && (
                            <p className="mt-6 text-xs text-slate-400">SIRET : {siret}</p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;