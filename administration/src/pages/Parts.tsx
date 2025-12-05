import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Part } from '../types';
import { PartList } from '../components/parts/PartList';
import { dataService } from '../utils/dataService';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Parts: React.FC = () => {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { canEdit } = useAuth();
    const isEditable = canEdit();

    const fetchParts = async () => {
        try {
            const data = await dataService.getParts();
            setParts(data);
        } catch (error) {
            console.error('Failed to load parts:', error);
            toast.error('Erreur lors du chargement des pièces.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
            try {
                await dataService.deletePart(id);
                fetchParts();
                toast.success('Pièce supprimée avec succès');
            } catch (error) {
                console.error('Error deleting part:', error);
                toast.error('Erreur lors de la suppression de la pièce.');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Stock de Pièces</h1>
                    <p className="text-slate-500 mt-1">Gérez votre stock de composants pour les mises à niveau et réparations.</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => navigate('/parts/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        <span>Ajouter une Pièce</span>
                    </button>
                )}
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    <PartList
                        parts={parts}
                        onEdit={(part) => navigate(`/parts/${part.id}/edit`)}
                        onDelete={handleDelete}
                        readonly={!isEditable}
                    />
                </div>
            </div>
        </div>
    );
};
