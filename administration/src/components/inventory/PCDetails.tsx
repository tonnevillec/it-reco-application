import React, { useEffect, useState } from 'react';
import type { PCState, Donor } from '../../types';
import { Monitor, Cpu, HardDrive, Calendar, Activity, Building2, Hash, Box, CreditCard, Wrench, Image as ImageIcon, Info, CheckCircle, XCircle } from 'lucide-react';
import { dataService } from '../../utils/dataService';

interface PCDetailsProps {
    pc: PCState;
}

export const PCDetails: React.FC<PCDetailsProps> = ({ pc }) => {
    const [donor, setDonor] = useState<Donor | null>(null);
    const [activeTab, setActiveTab] = useState<'infos' | 'config' | 'annonce' | 'reconditionnement' | 'photos'>('infos');

    useEffect(() => {
        const fetchDonor = async () => {
            if (pc.donor) {
                try {
                    const donorId = pc.donor.split('/').pop();
                    if (donorId) {
                        const data = await dataService.getDonor(donorId);
                        setDonor(data);
                    }
                } catch (error) {
                    console.error('Failed to load donor:', error);
                }
            }
        };
        fetchDonor();
    }, [pc.donor]);

    const getRamSummary = () => {
        const sticks = pc.ram?.sticks || [];
        const totalRam = sticks.reduce((acc, stick) => acc + (stick?.capacity || 0), 0);
        return `${totalRam}Go ${pc.ram?.type || 'Unknown'}`;
    };

    const getTypeIcon = () => {
        return <Box size={24} className="text-blue-600" />;
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <div>
                    <div className="flex items-center gap-2">
                        {getTypeIcon()}
                        <h2 className="text-2xl font-bold text-slate-800">{pc.brand} {pc.model}</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">ID: {pc.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${pc.isActif ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {pc.isActif ? 'Actif' : 'Inactif'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${pc.status.toUpperCase() === 'AVAILABLE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {pc.status.charAt(0).toUpperCase() + pc.status.slice(1).toLowerCase()}
                    </span>
                </div>
            </div>
            <div className="flex border-b border-slate-100 px-6">
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'infos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('infos')}
                >
                    Infos
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'config' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('config')}
                >
                    Configuration
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'annonce' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('annonce')}
                >
                    Annonce
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reconditionnement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('reconditionnement')}
                >
                    Reconditionnement
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'photos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('photos')}
                >
                    Photos
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                {activeTab === 'infos' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                                    <Hash size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Réf IT-Reco</p>
                                    <p className="font-mono text-slate-700">{pc.itRecoRef || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Date d'Achat</p>
                                    <p className="text-slate-700">{pc.purchaseDate ? new Date(pc.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Entreprise</p>
                                    <p className="text-slate-700 font-medium">{donor ? donor.name : 'Chargement...'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
                                    <Calendar size={18} className="text-slate-400" />
                                    <h3>Année & État</h3>
                                </div>
                                <div className="pl-7 space-y-2">
                                    <p className="text-sm"><span className="text-slate-500">Année :</span> {pc.year}</p>
                                    <p className="text-sm"><span className="text-slate-500">État :</span> {pc.pcCondition || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
                                    <CreditCard size={18} className="text-slate-400" />
                                    <h3>Prix & Statut</h3>
                                </div>
                                <div className="pl-7 space-y-2">
                                    <p className="text-sm"><span className="text-slate-500">Prix :</span> <span className="font-bold text-green-600">€{pc.price}</span></p>
                                    <p className="text-sm">
                                        <span className="text-slate-500">Statut :</span>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${pc.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {pc.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-1">Processeur</h3>
                                    <p className="font-medium text-slate-800">{pc.processor}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-1">RAM</h3>
                                    <p className="font-medium text-slate-800">{getRamSummary()}</p>
                                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                                        {pc.ram?.sticks?.map((stick, idx) => (
                                            stick && (
                                                <div key={idx}>
                                                    Slot {idx + 1}: {stick.capacity}Go {stick.brand}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <HardDrive size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-1">Stockage</h3>
                                    <div className="space-y-2">
                                        {pc.storage?.map((slot, idx) => (
                                            slot.disk && (
                                                <div key={idx} className="text-sm">
                                                    <p className="font-medium text-slate-800">
                                                        {slot.disk.capacity}GB {slot.type}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {slot.disk.brand} {slot.disk.description}
                                                    </p>
                                                </div>
                                            )
                                        ))}
                                        {(!pc.storage || pc.storage.every(s => !s.disk)) && (
                                            <p className="text-sm text-slate-400 italic">Aucun stockage installé</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Monitor size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-1">Écran & GPU</h3>
                                    {pc.screen ? (
                                        <>
                                            <p className="font-medium text-slate-800">{pc.screen.size}" {pc.screen.resolution}</p>
                                            <p className="text-xs text-slate-500">{pc.screen.type} {pc.screen.isTouch ? '(Tactile)' : ''}</p>
                                        </>
                                    ) : (
                                        <p className="font-medium text-slate-800">N/A</p>
                                    )}
                                    <p className="text-sm text-slate-600 mt-1">{pc.gpu}</p>
                                </div>
                            </div>
                        </div>

                        {pc.otherDetails && (
                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
                                    <Info size={18} className="text-slate-400" />
                                    <h3>Autre détail</h3>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{pc.otherDetails}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'annonce' && (
                    <div className="space-y-6">
                        {pc.announcement ? (
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{pc.announcement.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Publié le {pc.announcement.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${pc.announcement.isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {pc.announcement.isOnline ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {pc.announcement.isOnline ? 'En ligne' : 'Hors ligne'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Description</h4>
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{pc.announcement.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500">Aucune annonce configurée.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reconditionnement' && (
                    <div className="space-y-8">
                        {pc.refurbishment ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-800 mb-2">État Initial</h3>
                                        <p className="text-slate-600 whitespace-pre-wrap">{pc.refurbishment.initialState || 'Non renseigné'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-800 mb-2">Détails Reconditionnement</h3>
                                        <p className="text-slate-600 whitespace-pre-wrap">{pc.refurbishment.details || 'Non renseigné'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Wrench size={18} /> Pièces Utilisées
                                    </h3>
                                    {pc.refurbishment.partsUsed && pc.refurbishment.partsUsed.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {pc.refurbishment.partsUsed.map((partId, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                                                    Pièce #{partId}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic">Aucune pièce utilisée.</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <ImageIcon size={18} /> Photos du Reconditionnement
                                    </h3>
                                    {pc.refurbishment.photos && pc.refurbishment.photos.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {pc.refurbishment.photos.map((photo, idx) => (
                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video">
                                                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                                        <p className="text-white text-xs font-medium truncate text-center">{photo.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic">Aucune photo de reconditionnement.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500">Aucune information de reconditionnement.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'photos' && (
                    <div className="space-y-6">
                        {pc.images && pc.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {pc.images.map((img, idx) => (
                                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                                        <img src={img} alt={`PC ${idx + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">Aucune photo disponible.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
