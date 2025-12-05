import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEnvelope, faGears, faInfoCircle, faPhone, faXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import backApiSerrevis from "../services/backApiSerrevis.jsx";
import HorairesSerreVisInformatique from "./HorairesSerreVisInformatique.jsx";

import etagere1 from "../assets/etagere_pc_01.jpg"
import etagere2 from "../assets/etagere_pc_02.jpg"
import etagere3 from "../assets/etagere_pc_03.jpg"
import etagere4 from "../assets/etagere_pc_04.jpg"
import benoit from "../assets/serrevis-informatique-benoit.jpg"

const Partenaire = () => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApiSerrevis.apiFetch('/api/datas')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <section className="body-font bg-white py-24" id={"section-partenaire"}>
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">En collaboration avec ...</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                </div>

                {!loading &&
                    <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                        {/* Left Column: Partner Card */}
                        <div className="w-full lg:w-5/12">
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 lg:p-8 h-full border border-slate-100 relative overflow-hidden group hover:border-primary-100 transition-colors duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900">Serre-Vis Informatique</h2>
                                        <h3 className="text-lg text-primary-600 font-medium">Benoit Ricou</h3>
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row gap-6 items-center mb-8">
                                        <div className="flex-1 space-y-4 w-full">
                                            {datas.adresse.length > 0 &&
                                                <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 shrink-0 text-sm">
                                                        <FontAwesomeIcon icon={faLocationDot} />
                                                    </div>
                                                    <div className="text-slate-600 text-sm" dangerouslySetInnerHTML={{ __html: datas.adresse }} />
                                                </div>
                                            }
                                            {datas.telephone.length > 0 &&
                                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 shrink-0 text-sm">
                                                        <FontAwesomeIcon icon={faPhone} />
                                                    </div>
                                                    <span className="text-slate-600 font-medium text-sm">{datas.telephone}</span>
                                                </div>
                                            }
                                            {datas.mail.length > 0 &&
                                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 shrink-0 text-sm">
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </div>
                                                    <a href={`mailto:${datas.mail}`} className="text-slate-600 hover:text-primary-600 transition-colors font-medium text-sm">{datas.mail}</a>
                                                </div>
                                            }
                                        </div>
                                        <div className="shrink-0">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 transform translate-y-2"></div>
                                                <img src={benoit} alt="Benoit Ricou" className="relative w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl lg:p-5 border border-slate-100">
                                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                            Horaires d'ouverture
                                        </h4>
                                        <HorairesSerreVisInformatique />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Gallery & Features */}
                        <div className="w-full lg:w-7/12 flex flex-col gap-8">
                            {/* Feature Card */}
                            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg p-1">
                                <div className="bg-white rounded-xl p-6 h-full flex items-start gap-6">
                                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-50 text-primary-600 text-2xl shrink-0">
                                        <FontAwesomeIcon icon={faGears} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">Visibles et Testables</h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            Les PC reconditionnés par IT-RECO sont exposés directement chez Serre-Vis Informatique.
                                            Venez les découvrir et tester leur performance sur place avant de vous décider.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Gallery */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                                <div className="space-y-4">
                                    <img src={etagere1} alt="Etagère PC 1" className="w-full h-48 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
                                    <img src={etagere3} alt="Etagère PC 3" className="w-full h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <img src={etagere2} alt="Etagère PC 2" className="w-full h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
                                    <img src={etagere4} alt="Etagère PC 4" className="w-full h-48 object-cover rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* Bottom Section: Vision */}
                <div className="mt-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 transform -skew-y-1 rounded-3xl -z-10"></div>
                    <div className="relative bg-white rounded-3xl p-1 shadow-xl shadow-slate-200/50 max-w-5xl mx-auto">
                        <div className="bg-white rounded-[1.4rem] p-10 md:p-14 text-center border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-50"></div>

                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-8 text-primary-600 shadow-inner">
                                <FontAwesomeIcon icon={faGears} className="text-3xl" />
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-6">Une synergie locale pour votre satisfaction</h3>
                            <p className="text-slate-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                Travailler avec un professionnel de l'informatique situé sur Lesquin, c'est l'assurance d'un service de proximité, réactif et humain.
                                En collaborant avec <span className="font-semibold text-primary-600">Serre-Vis Informatique</span>, nous garantissons une expertise technique pointue et un suivi personnalisé pour tous vos besoins informatiques.
                                Cette synergie locale permet de réduire les délais d'intervention et de favoriser l'économie circulaire au sein de la métropole lilloise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Partenaire;