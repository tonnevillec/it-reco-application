import hello from "../assets/hero.jpg"
import stepContact from "../assets/step-contact.png"
import stepEstimation from "../assets/step-estimation.png"
import stepReconditionnement from "../assets/step-reconditionnement.png"
import stepVente from "../assets/step-vente.png"
import stepVendu from "../assets/step-vendu.png"
import stepRetry from "../assets/step-retry.png"
import cyril from "../assets/it-reco-cyril.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faLeaf, faRecycle, faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import backApi from "../services/backApi.jsx";
import Confiance from "./Confiance.jsx";
import ALaUne from "./ALaUne.jsx";
import Boutique from "./boutique/Boutique.jsx";
import Partenaire from "./Partenaire.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useScrollToAnchor } from "../hook/useScrollToAnchor.jsx";

const Landing = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const anchor = params.get("scrollTo");

    useScrollToAnchor(anchor);

    const [datas, setDatas] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/general_infos/1')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAnchorClick = (anchor) => {
        if (window.location.pathname !== "/") {
            navigate(`/?scrollTo=${anchor}`);
        } else {
            const element = document.getElementById(anchor);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative w-full min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden" id="section-header">
                <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary-200 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary-700 uppercase bg-primary-100 rounded-full">
                            Expert du réemploi informatique
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                            Donnez une <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">seconde vie</span> à votre parc informatique
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Valorisez votre matériel professionnel, réduisez votre empreinte carbone et participez à l'économie circulaire locale dans la Métropole Lilloise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/store" className="btn btn-primary btn-lg border-none bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
                                Voir la boutique
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                            <button onClick={() => handleAnchorClick('section-contact')} className="btn btn-outline btn-primary btn-lg hover:text-white transition-all">
                                Valoriser mon parc
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative animate-float hidden lg:block">
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img src={hello} alt="IT Reco Hero" className="w-full h-auto object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary-200 rounded-2xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* Alert Section */}
            {(!loading && datas.alertMessage) && (
                <div className="container mx-auto px-6 -mt-8 relative z-20">
                    <div className="glass p-6 rounded-xl border-l-4 border-primary-500 flex items-start gap-4">
                        <div className="text-primary-500 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: datas.alertMessage }} />
                    </div>
                </div>
            )}

            {(!loading && datas.activeNews.length > 0) && <ALaUne alaUne={datas.activeNews} />}

            {/* How it works */}
            <section className="py-24 bg-white" id="section-fonction">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Comment ça fonctionne ?</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Un processus simple, transparent et sécurisé pour revaloriser votre matériel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { img: stepContact, step: "01", title: "Prise de contact", desc: "Contactez-moi pour planifier un rendez-vous d'estimation." },
                            { img: stepEstimation, step: "02", title: "Estimation", desc: "Inspection et proposition de rachat immédiate." },
                            { img: stepReconditionnement, step: "03", title: "Reconditionnement", desc: "Effacement sécurisé des données, nettoyage et upgrade." },
                            { img: stepVente, step: "04", title: "Mise en vente", desc: "Vente via nos partenaires locaux et en ligne." }
                        ].map((item, idx) => (
                            <div key={idx} className="group bg-slate-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary-200 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                <div className="w-32 h-32 flex-shrink-0 bg-white rounded-xl p-2 shadow-sm group-hover:scale-105 transition-transform">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-primary-600 tracking-widest uppercase mb-1 block">Étape {item.step}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Scenarios */}
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-200 w-32 h-32 rounded-bl-full opacity-20"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                                <img src={stepVendu} alt="Succès" className="w-32 h-32 object-contain" />
                                <div>
                                    <h3 className="text-2xl font-bold text-green-800 mb-2">Scénario A : Succès</h3>
                                    <p className="text-green-700">Vous recevez votre paiement et un <b>Certificat de Réemploi</b> valorisant votre démarche RSE.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-slate-200 w-32 h-32 rounded-bl-full opacity-20"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                                <img src={stepRetry} alt="Sécurité" className="w-32 h-32 object-contain" />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Scénario B : Sécurité</h3>
                                    <p className="text-slate-700">Pas de vente sous 6 mois ? <b>Zéro frais</b>. Nous prenons en charge la fin de vie du produit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ambition Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="section-ambition">
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 rounded-full"></div>
                                <img src={cyril} alt="Cyril Tonneville" className="relative rounded-2xl shadow-2xl border-4 border-slate-700 transform -rotate-2 hover:rotate-0 transition-all duration-500 w-full max-w-md mx-auto" />
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold mb-6">Une vision <span className="text-primary-400">durable</span> et locale</h2>
                            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                                <p>
                                    <span className="text-white font-semibold text-xl block mb-2">Le constat d'un expert</span>
                                    Après 25 ans dans l'informatique, je refuse de voir du matériel professionnel conçu pour durer 10 ans être jeté après seulement 3 ans.
                                </p>
                                <p>
                                    <span className="text-white font-semibold text-xl block mb-2">Contre l'obsolescence</span>
                                    Je reconditionne les PC récents sous <b>Windows 11 Pro</b> et offre une seconde vie aux machines plus anciennes sous <b>Linux Mint</b>.
                                </p>
                                <p>
                                    <span className="text-white font-semibold text-xl block mb-2">Démocratiser la qualité</span>
                                    Permettre à tous de s'équiper avec du matériel professionnel robuste à prix accessible.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold text-white">Cyril Tonneville</h4>
                                    <span className="text-primary-400 text-sm">Fondateur d'IT-RECO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interests / Benefits */}
            <section className="py-24 bg-primary-50" id="section-interets">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Pourquoi choisir IT-RECO ?</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: faDollarSign, title: "Économique", desc: "Récupérez de la trésorerie sur votre matériel dormant et permettez à d'autres de s'équiper à moindre coût." },
                            { icon: faLeaf, title: "Écologique", desc: "Évitez 200kg de CO2 par ordinateur. Le meilleur déchet est celui qu'on ne produit pas." },
                            { icon: faRecycle, title: "Solidaire", desc: "Luttez contre la fracture numérique en rendant l'informatique de qualité accessible à tous." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center group">
                                <div className="w-20 h-20 mx-auto bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FontAwesomeIcon icon={item.icon} size="2x" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            {/* 
            <section className="py-20 bg-white" id="section-confiance">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Ils me font confiance</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                    </div>
                    <Confiance />

                    <div className="mt-16 text-center bg-slate-50 rounded-3xl p-12 max-w-4xl mx-auto border border-slate-100">
                        <h3 className="text-2xl font-bold mb-4">Et vous ?</h3>
                        <p className="text-slate-600 mb-8">Rejoignez les entreprises qui valorisent leur parc informatique intelligemment.</p>
                        <button onClick={() => handleAnchorClick('section-contact')} className="btn btn-primary btn-lg shadow-lg shadow-primary-500/30">
                            Demander une estimation gratuite
                        </button>
                    </div>
                </div>
            </section>
            */}

            {!loading && <Boutique leboncoin={datas.leboncoinUrl} />}

            <Partenaire />

            {/* Contact Section */}
            <section className="py-24 bg-slate-900 text-white relative" id="section-contact">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-8">Prêt à valoriser votre parc ?</h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Contactez-moi pour une estimation gratuite et sans engagement. Réponse rapide garantie.
                    </p>

                    {!loading && datas.contactEmail && (
                        <a href={`mailto:${datas.contactEmail}`} className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-xl hover:bg-primary-50 transition-colors shadow-2xl">
                            <FontAwesomeIcon icon={faEnvelope} className="text-primary-600" />
                            {datas.contactEmail}
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Landing;