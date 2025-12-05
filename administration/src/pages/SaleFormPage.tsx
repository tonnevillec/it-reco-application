import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaleForm, type SaleFormData } from '../components/sales/SaleForm';
import { dataService } from '../utils/dataService';
import type { PCState, Sale } from '../types';

export const SaleFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [availablePCs, setAvailablePCs] = useState<PCState[]>([]);

    useEffect(() => {
        const fetchPCs = async () => {
            try {
                const pcs = await dataService.getPCs();
                // Filter for available PCs. 
                // Note: The API might return PCState, which is compatible with PC for our purposes here
                // but we should check the status field.
                setAvailablePCs(pcs.filter(pc => pc.status === 'available' || pc.status === 'AVAILABLE'));
            } catch (error) {
                console.error('Error fetching PCs:', error);
            }
        };
        fetchPCs();
    }, []);

    const handleSubmit = async (data: SaleFormData) => {
        try {
            const pcId = data.pcId;
            const pcIri = `/api/p_cs/${pcId}`;

            const newSale: Omit<Sale, 'id'> = {
                date: new Date().toISOString(),
                customerName: data.customerName,
                invoiceNumber: data.invoiceNumber,
                totalAmount: data.amount,
                paymentMethod: data.paymentMethod,
                salesChannel: data.salesChannel as any, // Cast to match the literal type
                pcs: [pcIri],
                parts: []
            };

            await dataService.createSale(newSale);

            // Update PC status to sold
            // We need to fetch the current PC state to preserve other fields or just send the patch
            // dataService.updatePC expects Partial<PCState>
            await dataService.updatePC(pcId, {
                status: 'sold' // or 'SOLD' depending on backend enum
            });

            navigate('/sales');
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Une erreur est survenue lors de l\'enregistrement de la vente.');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/sales')}
                    className="text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
                >
                    ← Retour aux Ventes
                </button>
                <h1 className="text-3xl font-bold text-slate-800">
                    Enregistrer Nouvelle Vente
                </h1>
            </div>
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <SaleForm
                    availablePCs={availablePCs}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/sales')}
                />
            </div>
        </div>
    );
};
