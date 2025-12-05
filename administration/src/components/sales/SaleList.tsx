import React from 'react';
import type { Sale } from '../../types';
import { FileText, Calendar } from 'lucide-react';

interface SaleListProps {
    sales: Sale[];
}

export const SaleList: React.FC<SaleListProps> = ({ sales }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">N° Facture</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">PC Vendu</th>
                            <th className="px-6 py-4">Montant</th>
                            <th className="px-6 py-4">Canal</th>
                            <th className="px-6 py-4">Paiement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span>{new Date(sale.date).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                                        <FileText size={16} className="text-slate-400" />
                                        <span>{sale.invoiceNumber}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-800">{sale.customerName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        {sale.pcs && sale.pcs.length > 0 && typeof sale.pcs[0] !== 'string' ? (
                                            <>
                                                <p className="font-medium text-slate-800">
                                                    {(sale.pcs[0] as any).brand} {(sale.pcs[0] as any).model}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {(sale.pcs[0] as any).processor}
                                                </p>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 italic">Détails indisponibles</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-slate-800">€{sale.totalAmount}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600">{sale.salesChannel || '-'}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium capitalize">
                                        {sale.paymentMethod}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sales.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                    Aucune vente enregistrée pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
