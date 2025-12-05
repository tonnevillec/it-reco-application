import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GeneralInfoForm } from '../components/settings/GeneralInfoForm';
import { dataService } from '../utils/dataService';
import type { GeneralInfo } from '../types';
import { Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const GeneralInfoPage: React.FC = () => {
    const [info, setInfo] = useState<GeneralInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const { canEdit } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await dataService.getGeneralInfo();
                if (data) {
                    setInfo(data);

                } else {
                    // Initialize with default empty structure if no data exists
                    setInfo({
                        id: 0, // Placeholder
                        heroText: '',
                        alertMessage: '',
                        siret: '',
                        telephone: '',
                        contactEmail: '',
                        leboncoinUrl: '',
                        linkedinUrl: '',
                        legalMentions: '',
                        legalUpdateDate: new Date().toISOString().split('T')[0],
                        documents: [],
                        news: []
                    });
                }
            } catch (error) {
                console.error('Error loading general info:', error);
                toast.error('Erreur lors du chargement des informations.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (data: GeneralInfo) => {
        try {
            const saved = await dataService.saveGeneralInfo(data);
            setInfo(saved);
            toast.success('Paramètres enregistrés avec succès !');
        } catch (error) {
            console.error('Error saving general info:', error);
            toast.error('Erreur lors de l\'enregistrement.');
        }
    };

    if (loading || !info) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <Settings className="text-blue-600" size={32} />
                    Informations Générales
                </h1>
                <p className="text-slate-500 mt-1">Gérez les paramètres globaux de l'application et les détails de l'entreprise.</p>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <GeneralInfoForm
                    initialData={info}
                    onSubmit={handleSubmit}
                    readonly={!canEdit()}
                />
            </div>
        </div>
    );
};
