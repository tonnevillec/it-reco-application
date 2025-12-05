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

const InfoSerreVisInformatique = () => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    const showModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById('infos-serrevis');
        dialog.showModal();
    }

    const closeModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById('infos-serrevis');
        dialog.close();
    }

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
        <div className="w-full mb-8">
            <div className="bg-blue-50 border-l-4 border-primary-500 p-6 rounded-r-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-primary-500 text-3xl shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-slate-900 text-lg">Les PCs sont visibles et testables à l'atelier</h3>
                    <p className="text-slate-600 text-sm mt-1">
                        Rendez-vous chez Serre-Vis Informatique à Lesquin pour découvrir le matériel.
                    </p>
                </div>
                <button
                    onClick={showModal}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap group"
                >
                    En savoir plus <FontAwesomeIcon icon={faChevronRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <dialog id={"infos-serrevis"} className={"modal"}>
                <div className={"modal-box p-0 m-4 min-w-[90%] lg:min-w-[80%] max-w-6xl bg-emerald-50"}>
                    <div className={"w-full flex justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50 items-center shadow-sm"}>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faGears} className="text-primary" />
                            <span>Les PCs sont visibles et testables à l'atelier</span>
                        </h2>

                        <button type={"button"}
                            className={"btn btn-sm btn-circle btn-ghost"}
                            onClick={closeModal}>
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>
                    </div>

                    {!loading &&
                        <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-100px)] bg-slate-50">
                            <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                                {/* Left Column: Partner Card */}
                                <div className="w-full lg:w-5/12">
                                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 h-full border border-slate-100 relative overflow-hidden group hover:border-primary-100 transition-colors duration-300">
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

                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
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
                                    <div className="grid grid-cols-2 gap-4 h-full">
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
                        </div>
                    }
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default InfoSerreVisInformatique;