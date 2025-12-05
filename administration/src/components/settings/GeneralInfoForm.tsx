import React, { useState, useEffect } from 'react';
import type { GeneralInfo, Document, NewsItem } from '../../types';
import { Save, Upload, AlertTriangle, Type, Building2, Phone, Mail, Link as LinkIcon, Linkedin, Settings, Scale, Calendar, FileText, Trash2, Plus, Newspaper, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import clsx from 'clsx';

interface GeneralInfoFormProps {
    initialData: GeneralInfo;
    onSubmit: (data: GeneralInfo) => void;
    readonly?: boolean;
}

export const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ initialData, onSubmit, readonly = false }) => {
    const [formData, setFormData] = useState<GeneralInfo>(initialData);
    const [activeTab, setActiveTab] = useState<'config' | 'legal' | 'documents' | 'news'>('config');

    // New Document State
    const [newDoc, setNewDoc] = useState<{ name: string; date: string; file: File | null }>({
        name: '',
        date: new Date().toISOString().split('T')[0],
        file: null
    });

    // News State
    const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!readonly) {
            onSubmit(formData);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDocument = () => {
        if (newDoc.name && newDoc.date && newDoc.file) {
            // Check file size (limit to 5MB per file to be safe)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (newDoc.file.size > MAX_FILE_SIZE) {
                alert(`Le fichier est trop volumineux (${(newDoc.file.size / 1024 / 1024).toFixed(2)} Mo). La taille maximum par fichier est de 5 Mo.`);
                return;
            }



            const reader = new FileReader();
            reader.onloadend = () => {
                const newDocument: Document = {
                    id: Date.now().toString(),
                    name: newDoc.name,
                    date: newDoc.date,
                    fileName: newDoc.file!.name,
                    fileUrl: reader.result as string
                };

                setFormData({
                    ...formData,
                    documents: [...(formData.documents || []), newDocument]
                });

                // Reset form
                setNewDoc({
                    name: '',
                    date: new Date().toISOString().split('T')[0],
                    file: null
                });
            };
            reader.readAsDataURL(newDoc.file);
        }
    };

    const handleDeleteDocument = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            setFormData({
                ...formData,
                documents: (formData.documents || []).filter(d => d.id !== id)
            });
        }
    };

    const handleNewsPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingNews) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingNews({ ...editingNews, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveNews = () => {
        if (editingNews && editingNews.title && editingNews.description) {
            const newItem: NewsItem = {
                id: editingNews.id || Date.now().toString(),
                title: editingNews.title,
                photo: editingNews.photo || '',
                description: editingNews.description,
                active: editingNews.active || false,
                date: editingNews.date || new Date().toISOString()
            };

            const updatedNews = editingNews.id
                ? (formData.news || []).map(n => n.id === editingNews.id ? newItem : n)
                : [...(formData.news || []), newItem];

            setFormData({ ...formData, news: updatedNews });
            setEditingNews(null);
        }
    };

    const handleDeleteNews = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
            setFormData({
                ...formData,
                news: (formData.news || []).filter(n => n.id !== id)
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 px-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('config')}
                    className={clsx(
                        "px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'config'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Settings size={18} />
                    Configuration
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('legal')}
                    className={clsx(
                        "px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'legal'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Scale size={18} />
                    Mentions Légales
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className={clsx(
                        "px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'documents'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <FileText size={18} />
                    Documents
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('news')}
                    className={clsx(
                        "px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'news'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Newspaper size={18} />
                    Actualités
                </button>

            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">

                    {/* Configuration Tab */}
                    {activeTab === 'config' && (
                        <>
                            {/* Logo Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Upload size={20} className="text-blue-600" />
                                    Logo
                                </h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                        {formData.logoUrl ? (
                                            <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <span className="text-slate-400 text-sm">Aucun Logo</span>
                                        )}
                                    </div>
                                    {!readonly && (
                                        <div>
                                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-slate-700 font-medium">
                                                <Upload size={18} />
                                                <span>Télécharger Nouveau Logo</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                            </label>
                                            <p className="text-xs text-slate-500 mt-2">Taille recommandée : 200x200px. Max 2Mo.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hero & Alert Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Type size={16} /> Texte d'Accueil
                                    </label>
                                    <textarea
                                        className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none disabled:bg-slate-50 disabled:text-slate-500"
                                        value={formData.heroText}
                                        onChange={e => setFormData({ ...formData, heroText: e.target.value })}
                                        placeholder="Entrez le message d'accueil principal..."
                                        disabled={readonly}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <AlertTriangle size={16} /> Message d'Alerte
                                    </label>
                                    <textarea
                                        className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none disabled:bg-slate-50 disabled:text-slate-500"
                                        value={formData.alertMessage}
                                        onChange={e => setFormData({ ...formData, alertMessage: e.target.value })}
                                        placeholder="Entrez les alertes importantes (ex: fermetures pour congés)..."
                                        disabled={readonly}
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Informations de Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <Building2 size={16} /> SIRET
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            value={formData.siret || ''}
                                            onChange={e => setFormData({ ...formData, siret: e.target.value })}
                                            disabled={readonly}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <Phone size={16} /> Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            value={formData.telephone || ''}
                                            onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                            disabled={readonly}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <Mail size={16} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            value={formData.contactEmail || ''}
                                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                            disabled={readonly}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Liens Sociaux</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <LinkIcon size={16} /> URL Leboncoin
                                        </label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            value={formData.leboncoinUrl || ''}
                                            onChange={e => setFormData({ ...formData, leboncoinUrl: e.target.value })}
                                            disabled={readonly}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                            <Linkedin size={16} /> URL LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                            value={formData.linkedinUrl || ''}
                                            onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                            disabled={readonly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Legal Tab */}
                    {activeTab === 'legal' && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Calendar size={16} /> Date de mise à jour
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                        value={formData.legalUpdateDate || ''}
                                        onChange={e => setFormData({ ...formData, legalUpdateDate: e.target.value })}
                                        disabled={readonly}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Scale size={16} /> Mentions Légales
                                    </label>
                                    <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.legalMentions || ''}
                                            onChange={(content) => setFormData({ ...formData, legalMentions: content })}
                                            className="h-96 mb-12"
                                            readOnly={readonly}
                                            modules={{ toolbar: !readonly }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">


                            {/* Add Document Form */}
                            {!readonly && (
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Plus size={20} className="text-blue-600" />
                                        Ajouter un Document
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                                placeholder="Nom du Document"
                                                value={newDoc.name}
                                                onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                                value={newDoc.date}
                                                onChange={e => setNewDoc({ ...newDoc, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Fichier</label>
                                                <label className="flex items-center justify-center w-full px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-slate-500 text-sm truncate">
                                                    {newDoc.file ? newDoc.file.name : 'Choisir Fichier'}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={e => setNewDoc({ ...newDoc, file: e.target.files?.[0] || null })}
                                                    />
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddDocument}
                                                disabled={!newDoc.name || !newDoc.date || !newDoc.file}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Documents List */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fichier</th>
                                            {!readonly && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(!formData.documents || formData.documents.length === 0) ? (
                                            <tr>
                                                <td colSpan={readonly ? 3 : 4} className="px-6 py-8 text-center text-slate-500">
                                                    Aucun document ajouté pour le moment.
                                                </td>
                                            </tr>
                                        ) : (
                                            formData.documents?.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{doc.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">{doc.date}</td>
                                                    <td className="px-6 py-4 text-sm text-blue-600">
                                                        <a href={doc.fileUrl} download={doc.fileName} className="hover:underline flex items-center gap-1">
                                                            <FileText size={16} />
                                                            {doc.fileName}
                                                        </a>
                                                    </td>
                                                    {!readonly && (
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteDocument(doc.id)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* News Tab */}
                    {activeTab === 'news' && (
                        <div className="space-y-6">
                            {/* Add/Edit News Button */}
                            {!editingNews && !readonly && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setEditingNews({ active: true })}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
                                    >
                                        <Plus size={18} />
                                        Ajouter Actualité
                                    </button>
                                </div>
                            )}

                            {/* Edit Form */}
                            {editingNews && (
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {editingNews.id ? 'Modifier Actualité' : 'Ajouter Actualité'}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setEditingNews(null)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                                    value={editingNews.title || ''}
                                                    onChange={e => setEditingNews({ ...editingNews, title: e.target.value })}
                                                    placeholder="Titre de l'actualité"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Photo</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                                        {editingNews.photo ? (
                                                            <img src={editingNews.photo} alt="Preview" className="max-w-full max-h-full object-cover" />
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">Aucune Photo</span>
                                                        )}
                                                    </div>
                                                    <label className="px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium">
                                                        Choisir Image
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleNewsPhotoUpload} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={editingNews.active || false}
                                                        onChange={e => setEditingNews({ ...editingNews, active: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-slate-700">Actif (Visible)</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="h-full">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 h-[calc(100%-2rem)]">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={editingNews.description || ''}
                                                    onChange={(content) => setEditingNews({ ...editingNews, description: content })}
                                                    className="h-[200px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSaveNews}
                                            disabled={!editingNews.title || !editingNews.description}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save size={18} />
                                            Enregistrer Actualité
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* News List */}
                            <div className="grid grid-cols-1 gap-4">
                                {formData.news?.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-start hover:shadow-sm transition-shadow">
                                        <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            {item.photo ? (
                                                <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <Newspaper size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-slate-900 truncate">{item.title}</h4>
                                                    <p className="text-sm text-slate-500 mb-2">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {!readonly && (
                                                    <div className="flex items-center gap-2">
                                                        <span className={clsx(
                                                            "px-2 py-1 text-xs font-medium rounded-full",
                                                            item.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                                        )}>
                                                            {item.active ? 'Actif' : 'Masqué'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingNews(item)}
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        >
                                                            <Settings size={18} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNews(item.id)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="text-sm text-slate-600 line-clamp-2 prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: item.description }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!formData.news || formData.news.length === 0) && !editingNews && (
                                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                        <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Aucune actualité pour le moment. Cliquez sur "Ajouter Actualité" pour en créer une.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {!readonly && (
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20 font-medium"
                    >
                        <Save size={20} />
                        Enregistrer les Modifications
                    </button>
                </div>
            )}
        </form >
    );
};
