import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { PartForm } from '../components/parts/PartForm';
import { dataService } from '../utils/dataService';
import type { Part } from '../types';

export const PartFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<Part | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            dataService.getPart(id)
                .then(setInitialData)
                .catch(error => {
                    console.error('Error fetching part:', error);
                    navigate('/parts');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [id, navigate]);

    const handleSubmit = async (data: Omit<Part, 'id'>) => {
        try {
            if (id) {
                await dataService.updatePart(id, data);
                toast.success('Pièce mise à jour avec succès');
            } else {
                await dataService.createPart(data);
                toast.success('Pièce créée avec succès');
            }
            navigate('/parts');
        } catch (error) {
            console.error('Error saving part:', error);
            toast.error('Erreur lors de l\'enregistrement de la pièce.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/parts')}
                    className="text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
                >
                    ← Back to Parts
                </button>
                <h1 className="text-3xl font-bold text-slate-800">
                    {id ? 'Edit Part' : 'Add New Part'}
                </h1>
            </div>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <PartForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/parts')}
                />
            </div>
        </div>
    );
};
