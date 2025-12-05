import React, { useEffect, useState } from 'react';
import type { Sale, PCState } from '../types';
import { Monitor, Cpu, ShoppingCart, TrendingUp } from 'lucide-react';
import { dataService } from '../utils/dataService';

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalPCs: 0,
        availablePCs: 0,
        totalParts: 0,
        totalSales: 0,
        recentSales: [] as Sale[],
    });
    const [pcs, setPcs] = useState<PCState[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedPCs, fetchedParts, fetchedSales] = await Promise.all([
                    dataService.getPCs(),
                    dataService.getParts(),
                    dataService.getSales()
                ]);

                setPcs(fetchedPCs);

                const totalPCs = fetchedPCs.length;
                const availablePCs = fetchedPCs.filter(pc => pc.status?.toUpperCase() === 'AVAILABLE').length;
                const totalParts = fetchedParts.length;
                const totalSales = fetchedSales.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0);

                // Sort sales by date descending
                const sortedSales = [...fetchedSales].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setStats({
                    totalPCs,
                    availablePCs,
                    totalParts,
                    totalSales,
                    recentSales: sortedSales.slice(0, 5),
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    const getSaleProductNames = (sale: Sale) => {
        if (!sale.pcs || sale.pcs.length === 0) return 'N/A';

        return sale.pcs.map(pcOrIri => {
            if (typeof pcOrIri === 'string') {
                const id = pcOrIri.split('/').pop();
                const found = pcs.find(p => p.id.toString() === id);
                return found ? `${found.brand} ${found.model}` : 'PC Inconnu';
            } else {
                return `${pcOrIri.brand} ${pcOrIri.model}`;
            }
        }).join(', ');
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Aperçu des performances de votre activité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Monitor size={24} />
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium">PC Disponibles</h3>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.availablePCs}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium">Total Pièces</h3>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalParts}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium">Revenu Total</h3>
                        <p className="text-2xl font-bold text-slate-800 mt-1">€{stats.totalSales.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium">Total Ventes</h3>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stats.recentSales.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Ventes Récentes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Produit</th>
                                <th className="px-6 py-4 text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(sale.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {sale.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {getSaleProductNames(sale)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                        €{sale.totalAmount}
                                    </td>
                                </tr>
                            ))}
                            {stats.recentSales.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Aucune vente récente trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
