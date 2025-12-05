import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Donor } from '../types';
import { DonorList } from '../components/donors/DonorList';
import { dataService } from '../utils/dataService';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Donors: React.FC = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { canEdit } = useAuth();
    const isEditable = canEdit();

    const fetchDonors = async () => {
        try {
            const data = await dataService.getDonors();
            setDonors(data);
        } catch (error) {
            console.error('Failed to load donors:', error);
            toast.error('Erreur lors du chargement des entreprises.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
            try {
                await dataService.deleteDonor(id);
                fetchDonors();
                toast.success('Entreprise supprimée avec succès');
            } catch (error) {
                console.error('Error deleting donor:', error);
                toast.error('Erreur lors de la suppression de l\'entreprise.');
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
                    <h1 className="text-3xl font-bold text-slate-800">Entreprises</h1>
                    <p className="text-slate-500 mt-1">Gérez les entreprises partenaires.</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => navigate('/donors/new')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        <span>Ajouter une Entreprise</span>
                    </button>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <DonorList
                    donors={donors}
                    onEdit={(donor) => navigate(`/donors/${donor.id}/edit`)}
                    onDelete={handleDelete}
                    readonly={!isEditable}
                />
            </div>
        </div>
    );
};
