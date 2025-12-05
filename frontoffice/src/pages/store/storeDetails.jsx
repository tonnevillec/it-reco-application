import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import BackApi from "../../services/backApi.jsx";
import { BACK_URL } from "../../config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faXmark, faMicrochip, faMemory, faHardDrive, faDesktop, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useScrollToAnchor } from "../../hook/useScrollToAnchor.jsx";
import no_picture from "../../assets/no_picture.png";

const StoreDetails = () => {
    const params = useParams();
    const [item, setItem] = useState({})
    const [loading, setLoading] = useState(true)
    const [currentImage, setCurrentImage] = useState({})

    useScrollToAnchor('top');

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, [])

    const fetchDatas = async () => {
        try {
            const d = await BackApi.apiFetch('/p_cs/' + params.id);
            console.log(d)
            const mappedItem = {
                id: d.id,
                title: d.announcement?.title || `${d.brand} ${d.model}`,
                photos: (d.images || []).map((img, idx) => ({ id: idx, src: img })),
                sticker: d.type?.name || 'PC',
                promotion: null,
                isAvailable: d.status ?? d.status.toUpperCase() === 'AVAILABLE',
                refItReco: d.itRecoRef,
                codeProduit: d.model,
                year: d.year,
                description: d.announcement?.description || '',
                price: d.price,
                processor: d.processor,
                ram: d.ram,
                storage: d.storage,
                screen: d.screen,
                gpu: d.gpu,
                otherDetails: d.otherDetails,
                condition: d.pcCondition,
            }

            setItem(mappedItem)
            setCurrentImage(mappedItem.photos[0])
        } catch (error) {
            console.error(error)
        }
    }

    const showModal = (e) => {
        e.preventDefault()
        const dialog = document.getElementById(e.currentTarget.getAttribute('data-id'));
        dialog.showModal()
    }

    const closeModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById(e.currentTarget.getAttribute('data-id'));
        dialog.close();
    }

    const getPhotoSrc = (input) => {
        if (!input) return null;
        const src = input.src || input.url || input;
        if (typeof src === 'string') {
            if (src.startsWith('data:') || src.startsWith('http')) {
                return src;
            }
            return `${BACK_URL}/uploads/images/${src}`;
        }
        return null;
    }

    const renderRam = (ramData) => {
        if (!ramData) return '';

        let data = ramData;
        if (typeof ramData === 'string') {
            try {
                if (ramData.trim().startsWith('{') || ramData.trim().startsWith('[')) {
                    data = JSON.parse(ramData);
                }
            } catch (e) {
                return ramData;
            }
        }

        if (typeof data === 'object' && data !== null) {
            const sticks = data.sticks || [];
            const totalRam = sticks.reduce((acc, stick) => acc + (stick?.capacity || 0), 0);
            const type = data.type || '';

            return (
                <div>
                    <div>{totalRam}Go {type}</div>
                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                        {sticks.map((stick, idx) => (
                            stick && (
                                <div key={idx}>
                                    Slot {idx + 1}: {stick.capacity}Go {stick.brand}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            );
        }

        return data;
    }

    const renderStorage = (storageData) => {
        if (!storageData) return '';

        let data = storageData;
        if (typeof storageData === 'string') {
            try {
                if (storageData.trim().startsWith('{') || storageData.trim().startsWith('[')) {
                    data = JSON.parse(storageData);
                }
            } catch (e) {
                return storageData;
            }
        }

        if (Array.isArray(data)) {
            return (
                <div className="space-y-2">
                    {data.map((slot, idx) => (
                        slot && slot.disk && (
                            <div key={idx} className="text-sm">
                                <p className="font-medium text-slate-900">
                                    {slot.disk.capacity}Go {slot.disk.type || ''}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {slot.disk.brand} {slot.disk.description ? `- ${slot.disk.description}` : ''}
                                </p>
                            </div>
                        )
                    ))}
                </div>
            );
        }

        // Fallback for object structure
        if (typeof data === 'object' && data !== null) {
            const disks = data.disks || [];
            return disks.map(d => d ? `${d.capacity}Go ${d.type}` : '').filter(Boolean).join(' + ');
        }

        return data;
    }

    return (
        <section className="py-12 px-4 w-full bg-slate-50 min-h-screen" id="topX">
            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <span className="loading loading-spinner loading-lg text-primary-500"></span>
                </div>
            ) : (
                <div className="container mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link to={'/store'} className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors font-medium group">
                            <FontAwesomeIcon icon={faReply} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Retour à la boutique
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                            {/* Left Column: Images */}
                            <div className="lg:col-span-6 p-6 lg:p-8 bg-slate-50/50 border-r border-slate-100">
                                <figure className="relative rounded-2xl overflow-hidden shadow-lg bg-white aspect-[4/3] mb-6 group cursor-pointer" onClick={item.photos && item.photos.length > 0 ? showModal : undefined} data-id={item.photos && item.photos.length > 0 ? `boutique-card-${item.photos[0].id}` : ''}>
                                    {typeof currentImage !== 'undefined' && getPhotoSrc(currentImage) ?
                                        <img id="image-principale"
                                            src={getPhotoSrc(currentImage)}
                                            alt={item.title}
                                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        :
                                        <img src={no_picture}
                                            alt={item.title}
                                            className="w-full h-full object-contain opacity-50"
                                        />
                                    }

                                    {/* Visual Cues */}
                                    {(item.promotion !== null && item.promotion !== '') && (
                                        <div className="absolute top-5 -right-12 w-40 bg-gradient-to-r from-red-600 to-red-500 text-white text-center transform rotate-45 text-xs font-bold py-1.5 shadow-lg uppercase tracking-wider z-10 border-b-2 border-red-800">
                                            Promotion
                                        </div>
                                    )}
                                    {item.isAvailable === false && (
                                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-slate-900/10 backdrop-blur-[1px]">
                                            <div className="transform -rotate-12 border-4 border-white text-white px-6 py-2 text-2xl font-black uppercase tracking-widest shadow-2xl drop-shadow-lg">
                                                Revalorisé
                                            </div>
                                        </div>
                                    )}

                                    {item.photos && item.photos.length > 0 && (
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            Cliquez pour agrandir
                                        </div>
                                    )}
                                </figure>

                                <div className="flex gap-3 justify-center flex-wrap">
                                    {item.photos && item.photos.map(img =>
                                        <button
                                            key={img.id}
                                            onClick={() => setCurrentImage(img)}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImage.id === img.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent hover:border-slate-300'}`}
                                        >
                                            <img src={getPhotoSrc(img)}
                                                className="w-full h-full object-cover"
                                                alt={item.title}
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* Modal */}
                                {item.photos && item.photos.length > 0 && (
                                    <dialog id={`boutique-card-${item.photos[0].id}`} className="modal">
                                        <div className="modal-box max-w-5xl w-11/12 p-0 bg-slate-900/95 backdrop-blur-xl overflow-hidden h-[90vh]">
                                            <div className="absolute top-4 right-4 z-50">
                                                <button
                                                    className="btn btn-circle btn-ghost text-white hover:bg-white/20"
                                                    data-id={`boutique-card-${item.photos[0].id}`}
                                                    onClick={closeModal}>
                                                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                                                </button>
                                            </div>

                                            <div className="flex h-full flex-col lg:flex-row">
                                                {/* Thumbnails Sidebar */}
                                                <div className="hidden lg:flex flex-col gap-4 p-6 w-32 overflow-y-auto border-r border-white/10 bg-black/20">
                                                    {item.photos.map(i =>
                                                        <button
                                                            key={i.id}
                                                            onClick={() => setCurrentImage(i)}
                                                            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImage.id === i.id ? 'border-primary-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                        >
                                                            <img
                                                                src={getPhotoSrc(i)}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Main Image View */}
                                                <div className="flex-1 flex items-center justify-center p-4 lg:p-10 relative">
                                                    <img
                                                        alt={currentImage.title}
                                                        className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                                        src={getPhotoSrc(currentImage)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <form method="dialog" className="modal-backdrop">
                                            <button>close</button>
                                        </form>
                                    </dialog>
                                )}
                            </div>


                            {/* Right Column: Details */}
                            <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col bg-white">
                                <div className="mb-6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-primary-500 text-white`}>
                                        {item.sticker}
                                    </span>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">{item.title}</h1>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    {(item.refItReco !== null && item.refItReco !== '') && (
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Référence IT-RECO</span>
                                            <span className="font-mono text-slate-700 font-medium">{item.refItReco}</span>
                                        </div>
                                    )}
                                    {(item.codeProduit !== null && item.codeProduit !== '') && (
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Modèle</span>
                                            <span className="text-slate-700 font-medium">{item.codeProduit}</span>
                                        </div>
                                    )}
                                    {(item.year !== null && item.year !== '') && (
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Année</span>
                                            <span className="font-mono text-slate-700 font-medium">{item.year}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Configuration Details */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Configuration</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <FontAwesomeIcon icon={faMicrochip} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-0.5">Processeur</h4>
                                                <p className="text-sm font-medium text-slate-900">{item.processor}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                <FontAwesomeIcon icon={faMemory} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-0.5">RAM</h4>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {renderRam(item.ram)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                <FontAwesomeIcon icon={faHardDrive} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-0.5">Stockage</h4>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {renderStorage(item.storage)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                                <FontAwesomeIcon icon={faDesktop} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-0.5">Écran & GPU</h4>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {typeof item.screen === 'object' && item.screen !== null
                                                        ? `${item.screen.size}" ${item.screen.type} (${item.screen.resolution})`
                                                        : item.screen
                                                    }
                                                </p>
                                                {item.gpu && <p className="text-xs text-slate-500 mt-0.5">{item.gpu}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {item.otherDetails && (
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold text-sm">
                                                <FontAwesomeIcon icon={faInfoCircle} className="text-slate-400" />
                                                <h3>Autre détail</h3>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{item.otherDetails}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>



                                <div className="mt-auto pt-8 border-t border-slate-100">
                                    <div className="flex items-end gap-4 mb-2">
                                        {(item.promotion !== null && item.promotion !== '') ? (
                                            <>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-slate-400 font-medium line-through mb-1">Prix initial</span>
                                                    <span className="text-2xl text-slate-400 font-bold line-through">{item.price} €</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-red-500 font-bold uppercase tracking-wider mb-1">Prix promo</span>
                                                    <span className="text-4xl lg:text-5xl font-bold text-primary-600">{item.promotion} €</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Prix</span>
                                                <span className="text-4xl lg:text-5xl font-bold text-slate-900">{item.price} €</span>
                                            </div>
                                        )}
                                        <span className="text-sm text-slate-400 font-medium mb-2">TTC</span>
                                    </div>

                                    {item.isAvailable === false && (
                                        <div className="mt-4 p-4 bg-slate-100 rounded-xl text-slate-600 font-medium text-center">
                                            Ce produit n'est plus disponible à la vente.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description & Etat Section */}
                        <div className="p-8 lg:p-12 border-t border-slate-100 bg-slate-50/30">
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 not-prose">Description</h3>
                                <p className="whitespace-pre-wrap mb-8">{item.description}</p>

                                {item.condition && (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 not-prose">État</h3>
                                        <p className="whitespace-pre-wrap">{item.condition}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default StoreDetails;