import React, { useState } from 'react';
import type { Sale, PC, PCState } from '../../types';

export interface SaleFormData {
    pcId: string;
    customerName: string;
    invoiceNumber: string;
    amount: number;
    paymentMethod: string;
    salesChannel: string;
}

interface SaleFormProps {
    availablePCs: PCState[];
    onSubmit: (data: SaleFormData) => void;
    onCancel: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ availablePCs, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<SaleFormData>({
        pcId: '',
        customerName: '',
        invoiceNumber: '',
        amount: 0,
        paymentMethod: 'Card',
        salesChannel: 'Site',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const selectedPC = availablePCs.find(pc => pc.id === formData.pcId);

    // Auto-fill amount when PC is selected
    const handlePCChange = (pcId: string) => {
        const pc = availablePCs.find(p => p.id === pcId);
        setFormData({
            ...formData,
            pcId,
            amount: pc ? pc.price : 0,
        });
    };

    const getRamSummary = (pc: PCState) => {
        const sticks = pc.ram?.sticks || [];
        const totalRam = sticks.reduce((acc, stick) => acc + (stick?.capacity || 0), 0);
        return `${totalRam}GB ${pc.ram?.type || 'Unknown'}`;
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">Enregistrer Nouvelle Vente</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sélectionner PC</label>
                    <select
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                        value={formData.pcId}
                        onChange={e => handlePCChange(e.target.value)}
                    >
                        <option value="">-- Sélectionner un PC --</option>
                        {availablePCs.map(pc => (
                            <option key={pc.id} value={pc.id}>
                                {pc.brand} {pc.model} - €{pc.price}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom du Client</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={formData.customerName}
                        onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Numéro de Facture</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                        value={formData.invoiceNumber}
                        onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Montant (€)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Moyen de Paiement</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                            value={formData.paymentMethod}
                            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        >
                            <option value="Card">Carte</option>
                            <option value="Cash">Espèces</option>
                            <option value="Transfer">Virement</option>
                            <option value="Other">Autre</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Canal de Vente</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                        value={formData.salesChannel}
                        onChange={e => setFormData({ ...formData, salesChannel: e.target.value })}
                    >
                        <option value="Site">Site</option>
                        <option value="Leboncoin">Leboncoin</option>
                        <option value="Serre-Vi informatique">Serre-Vi informatique</option>
                    </select>
                </div>

                {selectedPC && (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                        <p><span className="font-semibold">Sélectionné :</span> {selectedPC.brand} {selectedPC.model}</p>
                        <p className="text-xs mt-1">{selectedPC.processor}, {getRamSummary(selectedPC)}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        Enregistrer Vente
                    </button>
                </div>
            </form>
        </div>
    );
};
