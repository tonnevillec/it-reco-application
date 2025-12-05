import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faGears, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import legals from "../../assets/legals.png";

const DisclaimerBoutique = () => {
    const showModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById('disclaimer-boutique');
        dialog.showModal();
    }

    const closeModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById('disclaimer-boutique');
        dialog.close();
    }

    return (
        <div className="w-full mb-8">
            <div className="bg-blue-50 border-l-4 border-primary-500 p-6 rounded-r-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-primary-500 text-3xl shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-slate-900 text-lg">La Sécurité IT-RECO : 3 Mois de Garantie Inclus</h3>
                    <p className="text-slate-600 text-sm mt-1">
                        Achetez en toute sérénité avec notre garantie commerciale pièces et main-d'œuvre.
                    </p>
                </div>
                <button
                    onClick={showModal}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap group"
                >
                    En savoir plus <FontAwesomeIcon icon={faChevronRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <dialog id={"disclaimer-boutique"} className={"modal"}>
                <div className={"modal-box p-0 m-4 min-w-[90%] lg:min-w-[80%] max-w-6xl bg-emerald-50"}>
                    <div className={"w-full flex justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50 items-center shadow-sm"}>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faGears} className="text-primary" />
                            <span>La Sécurité IT-RECO : 3 Mois de Garantie Inclus</span>
                        </h2>

                        <button type={"button"}
                            className={"btn btn-sm btn-circle btn-ghost"}
                            onClick={closeModal}>
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>
                    </div>

                    <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-100px)] bg-slate-50">
                        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                            {/* Left Column: Text Content */}
                            <div className="w-full lg:w-7/12">
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 h-full border border-slate-100 relative overflow-hidden group hover:border-primary-100 transition-colors duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>

                                    <div className="relative z-10">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Achetez l'esprit tranquille</h2>
                                            <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                                        </div>

                                        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                            <p>
                                                Contrairement à la vente entre particuliers qui peut s'avérer risquée, <span className="font-bold text-slate-900">IT-RECO engage sa responsabilité</span> sur chaque produit vendu.
                                            </p>

                                            <div className="bg-blue-50 border-l-4 border-primary-500 p-4 rounded-r-xl">
                                                <p className="font-medium text-slate-800">
                                                    Tous nos ordinateurs sont vendus avec une <span className="font-bold text-primary-600">Garantie Commerciale de 3 mois</span> (pièces et main-d'œuvre).
                                                </p>
                                            </div>

                                            <p>
                                                En plus de cette garantie commerciale, vous bénéficiez également des garanties légales de conformité et des vices cachés. Nous nous engageons à vous fournir un matériel fiable et durable.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Image */}
                            <div className="w-full lg:w-5/12">
                                <div className="h-full bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 relative group">
                                    <img src={legals} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" alt="Illustration garantie" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <FontAwesomeIcon icon={faGears} />
                                            </div>
                                            <span className="font-bold text-lg">Service Premium</span>
                                        </div>
                                        <p className="text-white/90 text-sm">Une expertise technique à votre service pour un achat sécurisé.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default DisclaimerBoutique;