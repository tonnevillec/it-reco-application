import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Pencil, Save, X, Monitor } from 'lucide-react';
import { dataService } from '../utils/dataService';
import type { PCTypeDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

export const PCTypesPage: React.FC = () => {
    const [types, setTypes] = useState<PCTypeDefinition[]>([]);
    const [newType, setNewType] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(true);
    const { canEdit } = useAuth();
    const isEditable = canEdit();

    const fetchTypes = async () => {
        try {
            const data = await dataService.getPCTypes();
            setTypes(data);
        } catch (error) {
            console.error('Failed to load PC types:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleAddType = async () => {
        if (!newType.trim()) return;

        const code = newType.trim().toLowerCase().replace(/\s+/g, '-');

        try {
            const created = await dataService.createPCType({
                label: newType.trim(),
                code: code
            });
            setNewType('');
            setTypes([...types, created]);
            toast.success('Type ajouté avec succès');
        } catch (error) {
            console.error('Failed to add PC type:', error);
            toast.error('Erreur lors de l\'ajout du type');
        }
    };

    const handleDeleteType = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce type ?')) return;

        try {
            await dataService.deletePCType(id);
            setTypes(types.filter(t => t.id !== id));
            toast.success('Type supprimé avec succès');
        } catch (error) {
            console.error('Failed to delete PC type:', error);
            toast.error('Erreur lors de la suppression du type');
        }
    };

    const handleStartEdit = (type: PCTypeDefinition) => {
        setEditingId(type.id);
        setEditValue(type.label);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editValue.trim()) return;

        try {
            const code = editValue.trim().toLowerCase().replace(/\s+/g, '-');
            const updated = await dataService.updatePCType(editingId, {
                label: editValue.trim(),
                code: code
            });
            setTypes(types.map(t => t.id === editingId ? updated : t));
            setEditingId(null);
            setEditValue('');
            toast.success('Type mis à jour avec succès');
        } catch (error) {
            console.error('Failed to update PC type:', error);
            toast.error('Erreur lors de la modification du type');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Monitor className="text-blue-600" size={32} />
                        Types de PC
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez les types d'ordinateurs disponibles (Tour, Portable, AIO, etc.)</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                {isEditable && (
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                placeholder="Nouveau type (ex: Mini PC)"
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
                            />
                            <button
                                type="button"
                                onClick={handleAddType}
                                disabled={!newType.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm h-[42px]"
                            >
                                Ajouter Type
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-auto divide-y divide-slate-100">
                    {types.map((type) => (
                        <div key={type.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            {editingId === type.id ? (
                                <div className="flex-1 flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 px-3 py-1.5 rounded border border-blue-200 focus:border-blue-500 outline-none text-sm"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit();
                                            if (e.key === 'Escape') handleCancelEdit();
                                        }}
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                            title="Enregistrer"
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                                            title="Annuler"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="font-medium text-slate-700">{type.label}</span>
                                    {isEditable && (
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleStartEdit(type)}
                                                className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                                                title="Modifier Type"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteType(type.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                                                title="Supprimer Type"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    {types.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            Aucun type de PC défini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
