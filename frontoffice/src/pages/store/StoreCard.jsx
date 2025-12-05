import React from 'react';
import { BACK_URL } from "../../config.js";
import { Link } from "react-router-dom";
import no_picture from "../../assets/no_picture.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const StoreCard = ({ item }) => {
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

    const mainPhoto = (item.photos && item.photos[0]) || (item.images && item.images[0]);
    const photoSrc = getPhotoSrc(mainPhoto);

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
            <figure className="relative h-64 overflow-hidden">
                {photoSrc ?
                    <img src={photoSrc}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    :
                    <img src={no_picture}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-50"
                    />
                }
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md bg-white/90 text-slate-800`}>
                    {item.sticker.title || item.sticker}
                </div>
                {(item.promotion !== null && item.promotion !== '') && (
                    <div className="absolute top-5 -right-12 w-40 bg-gradient-to-r from-red-600 to-red-500 text-white text-center transform rotate-45 text-xs font-bold py-1.5 shadow-lg uppercase tracking-wider z-10 border-b-2 border-red-800">
                        Promotion
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="transform -rotate-12 border-4 border-white text-white px-6 py-2 text-2xl font-black uppercase tracking-widest shadow-2xl drop-shadow-lg">
                            Revalorisé
                        </div>
                    </div>
                )}
            </figure>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <Link to={"/store/" + item.id} className="block text-lg font-bold text-slate-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                        {item.title}
                    </Link>
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                        {item.refItReco && <span>Réf: {item.refItReco}</span>}
                        {item.codeProduit && <span>Modèle: {item.codeProduit}</span>}
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {(item.promotion !== null && item.promotion !== '') ? (
                            <>
                                <span className="text-sm text-slate-400 line-through">{item.price} €</span>
                                <span className="text-2xl font-bold text-primary-600">{item.promotion} €</span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-slate-900">{item.price} €</span>
                        )}
                    </div>

                    <Link to={"/store/" + item.id} className="btn btn-ghost btn-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 group">
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-1 group-hover:scale-110 transition-transform" /> de détails
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StoreCard;