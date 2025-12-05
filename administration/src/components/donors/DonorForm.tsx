import React, { useState, useEffect } from 'react';
import type { Donor, DonorDocument } from '../../types';
import { Plus, FileText, Trash2 } from 'lucide-react';

interface DonorFormProps {
    initialData?: Donor | null;
    onSubmit: (data: Omit<Donor, 'id'>) => void;
    onCancel: () => void;
}

export const DonorForm: React.FC<DonorFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        phone: '',
        siret: '',
        address: '',
    });

    const [documents, setDocuments] = useState<DonorDocument[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                company: initialData.company || '',
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone || '',
                siret: initialData.siret || '',
                address: initialData.address || '',
            });
            setDocuments(initialData.documents);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: initialData?.id || '', // Handle ID in parent or omit
            documents,
        } as any); // Type cast or fix interface
    };

    const [newDoc, setNewDoc] = useState<{ name: string; file: File | null }>({
        name: '',
        file: null
    });

    const handleAddDocument = () => {
        if (newDoc.name && newDoc.file) {
            // Check file size (limit to 5MB per file to be safe)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (newDoc.file.size > MAX_FILE_SIZE) {
                alert(`Le fichier est trop volumineux (${(newDoc.file.size / 1024 / 1024).toFixed(2)} Mo). La taille maximum par fichier est de 5 Mo.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const doc: DonorDocument = {
                    id: Date.now().toString(),
                    name: newDoc.name,
                    dateAdded: new Date().toISOString().split('T')[0],
                    fileName: newDoc.file!.name,
                    fileUrl: reader.result as string
                };
                setDocuments([...documents, doc]);
                setNewDoc({ name: '', file: null });
            };
            reader.readAsDataURL(newDoc.file);
        }
    };

    const removeDocument = (id: string) => {
        setDocuments(documents.filter(d => d.id !== id));
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Modifier Entreprise' : 'Ajouter Nouvelle Entreprise'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'Entreprise</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom du Contact</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email du Contact</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SIRET</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.siret}
                            onChange={e => setFormData({ ...formData, siret: e.target.value })}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-20"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div >

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Documents</h3>

                    {/* Add Document Form */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Document</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                                    placeholder="Ex: Kbis, RIB..."
                                    value={newDoc.name}
                                    onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fichier</label>
                                <label className="flex items-center justify-center w-full px-3 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-slate-500 text-sm truncate">
                                    <span className="truncate">{newDoc.file ? newDoc.file.name : 'Choisir un fichier...'}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={e => setNewDoc({ ...newDoc, file: e.target.files?.[0] || null })}
                                    />
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleAddDocument}
                                    disabled={!newDoc.name || !newDoc.file}
                                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <Plus size={16} /> Ajouter
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                                        <a
                                            href={doc.fileUrl}
                                            download={doc.fileName}
                                            className="text-xs text-slate-500 hover:text-blue-600 hover:underline truncate block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {doc.fileName}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{doc.dateAdded}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(doc.id)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {documents.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                                <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">Aucun document joint pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        {initialData ? 'Enregistrer' : 'Ajouter Entreprise'}
                    </button>
                </div>
            </form >
        </div >
    );
};
