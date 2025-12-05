import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { PCDetails } from '../components/inventory/PCDetails';
import { dataService } from '../utils/dataService';
import type { PCState } from '../types';

export const InventoryDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pc, setPc] = useState<PCState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPC = async () => {
            if (id) {
                try {
                    const data = await dataService.getPC(id);
                    setPc(data);
                } catch (error) {
                    console.error('Failed to load PC:', error);
                    toast.error('Erreur lors du chargement du PC.');
                    navigate('/inventory');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPC();
    }, [id, navigate]);

    if (loading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    if (!pc) {
        return null;
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
                    {pc.brand} {pc.model}
                </h1>
            </div>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <PCDetails pc={pc} />
            </div>
        </div>
    );
};
