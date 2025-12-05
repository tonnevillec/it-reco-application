import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { DonorForm } from '../components/donors/DonorForm';
import { dataService } from '../utils/dataService';
import type { Donor } from '../types';

export const DonorFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<Donor | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            dataService.getDonor(id)
                .then(setInitialData)
                .catch(error => {
                    console.error('Error fetching donor:', error);
                    navigate('/donors');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [id, navigate]);

    const handleSubmit = async (data: Omit<Donor, 'id'>) => {
        try {
            if (id) {
                await dataService.updateDonor(id, data);
                toast.success('Entreprise mise à jour avec succès');
            } else {
                await dataService.createDonor(data);
                toast.success('Entreprise créée avec succès');
            }
            navigate('/donors');
        } catch (error) {
            console.error('Error saving donor:', error);
            toast.error('Erreur lors de l\'enregistrement de l\'entreprise.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/donors')}
                    className="text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
                >
                    ← Retour aux Entreprises
                </button>
                <h1 className="text-3xl font-bold text-slate-800">
                    {id ? 'Modifier l\'Entreprise' : 'Ajouter une Entreprise'}
                </h1>
            </div>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <DonorForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/donors')}
                />
            </div>
        </div>
    );
};
