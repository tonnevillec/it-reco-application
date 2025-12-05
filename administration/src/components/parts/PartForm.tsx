import React, { useState, useEffect } from 'react';
import type { Part, PartType } from '../../types';

interface PartFormProps {
    initialData?: Part | null;
    onSubmit: (data: Omit<Part, 'id'>) => void;
    onCancel: () => void;
}

export const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'purchase'>('general');
    const [formData, setFormData] = useState<{
        name: string;
        brand: string;
        category: string;
        purchasePrice: number;
        specifications: string;
        purchaseDate: string;
        invoice: { fileName: string; fileUrl: string } | null;
        seller: string;
        status: string;
    }>({
        name: '',
        brand: '',
        category: 'Other',
        purchasePrice: 0,
        specifications: '',
        purchaseDate: '',
        invoice: null,
        seller: '',
        status: 'STOCK', // Default status
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                brand: initialData.brand || '',
                category: initialData.category,
                purchasePrice: initialData.purchasePrice || 0,
                specifications: initialData.specifications || '',
                purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : '',
                invoice: initialData.invoice || null,
                seller: initialData.seller || '',
                status: initialData.status || 'STOCK',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as any);
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Modifier Pièce' : 'Ajouter Nouvelle Pièce'}
                </h2>
            </div>

            <div className="flex border-b border-slate-100 px-6">
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('general')}
                >
                    Informations Générales
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'purchase' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('purchase')}
                >
                    Détails d'Achat
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'general' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Marque</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="ex: Corsair, Samsung"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="RAM">RAM</option>
                                <option value="Storage">Stockage</option>
                                <option value="GPU">GPU</option>
                                <option value="Other">Autre</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (€)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.purchasePrice}
                                    onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Spécifications</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none h-24 resize-none"
                                value={formData.specifications}
                                onChange={e => setFormData({ ...formData, specifications: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {
                    activeTab === 'purchase' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date d'Achat</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                        value={formData.purchaseDate}
                                        onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Vendeur</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                        value={formData.seller}
                                        onChange={e => setFormData({ ...formData, seller: e.target.value })}
                                        placeholder="ex: Amazon, Magasin Local"
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Facture d'Achat</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({
                                                            ...formData,
                                                            invoice: {
                                                                fileName: file.name,
                                                                fileUrl: reader.result as string
                                                            }
                                                        });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {formData.invoice && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <span className="font-medium">Fichier actuel :</span>
                                                <a
                                                    href={formData.invoice.fileUrl}
                                                    download={formData.invoice.fileName}
                                                    className="text-blue-600 hover:underline truncate max-w-[200px]"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {formData.invoice.fileName}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, invoice: null })}
                                                    className="text-red-500 hover:text-red-700 ml-auto"
                                                    title="Supprimer le fichier"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        {initialData ? 'Enregistrer' : 'Ajouter Pièce'}
                    </button>
                </div>
            </form >
        </div >
    );
};
