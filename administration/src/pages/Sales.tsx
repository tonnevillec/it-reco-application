import React, { useState, useEffect } from 'react';
import type { Sale } from '../types';
import { SaleList } from '../components/sales/SaleList';
import { dataService } from '../utils/dataService';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const Sales: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await dataService.getSales();
                setSales(data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };
        fetchSales();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Historique des Ventes</h1>
                    <p className="text-slate-500 mt-1">Suivez les ordinateurs vendus et les revenus.</p>
                </div>
                <button
                    onClick={() => navigate('/sales/new')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    <span>Enregistrer une Vente</span>
                </button>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    <SaleList sales={sales} />
                </div>
            </div>
        </div>
    );
};
