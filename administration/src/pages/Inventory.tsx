import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { PCState } from '../types';
import { PCList } from '../components/inventory/PCList';
import { dataService } from '../utils/dataService';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Inventory: React.FC = () => {
    const [pcs, setPcs] = useState<PCState[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { canEdit } = useAuth();
    const isEditable = canEdit();

    const fetchPCs = async () => {
        try {
            const data = await dataService.getPCs();
            setPcs(data);
        } catch (error) {
            console.error('Failed to load PCs:', error);
            toast.error('Erreur lors du chargement de l\'inventaire.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPCs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce PC ?')) {
            try {
                await dataService.deletePC(id);
                fetchPCs();
                toast.success('PC supprimé avec succès');
            } catch (error) {
                console.error('Error deleting PC:', error);
                toast.error('Erreur lors de la suppression du PC.');
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
                    <h1 className="text-3xl font-bold text-slate-800">Inventaire PC</h1>
                    <p className="text-slate-500 mt-1">Gérez votre stock d'ordinateurs reconditionnés.</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => navigate('/inventory/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        <span>Ajouter un PC</span>
                    </button>
                )}
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    <PCList
                        pcs={pcs}
                        onEdit={(pc) => navigate(`/inventory/${pc.id}/edit`)}
                        onDelete={handleDelete}
                        onView={(pc) => navigate(`/inventory/${pc.id}`)}
                        readonly={!isEditable}
                    />
                </div>
            </div>
        </div>
    );
};
