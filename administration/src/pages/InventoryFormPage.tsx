import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { PCForm } from '../components/inventory/PCForm';
import { dataService } from '../utils/dataService';
import type { PCState } from '../types';

export const InventoryFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<PCState | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);

    useEffect(() => {
        const fetchPC = async () => {
            if (id) {
                try {
                    const pc = await dataService.getPC(id);
                    setInitialData(pc);
                } catch (error) {
                    console.error('Failed to load PC:', error);
                    toast.error('Erreur lors du chargement du PC.');
                    navigate('/inventory');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchPC();
    }, [id, navigate]);

    const handleSubmit = async (data: any) => {
        try {
            if (id) {
                await dataService.updatePC(id, data);
                toast.success('PC mis à jour avec succès');
            } else {
                await dataService.createPC({
                    ...data,
                    status: 'available',
                });
                toast.success('PC créé avec succès');
            }
            navigate('/inventory');
        } catch (error) {
            console.error('Error saving PC:', error);
            toast.error('Erreur lors de l\'enregistrement du PC.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/inventory')}
                    className="text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
                >
                    ← Retour à l'Inventaire
                </button>
                <h1 className="text-3xl font-bold text-slate-800">
                    {id ? 'Modifier PC' : 'Ajouter Nouveau PC'}
                </h1>
            </div>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <PCForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/inventory')}
                />
            </div>
        </div>
    );
};
