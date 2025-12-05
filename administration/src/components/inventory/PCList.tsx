import React from 'react';
import type { PCState } from '../../types';
import { Edit, Trash2, Eye } from 'lucide-react';
import clsx from 'clsx';

interface PCListProps {
    pcs: PCState[];
    onEdit: (pc: PCState) => void;
    onDelete: (id: string) => void;
    onView: (pc: PCState) => void;
    readonly?: boolean;
}

export const PCList: React.FC<PCListProps> = ({ pcs, onEdit, onDelete, onView, readonly = false }) => {
    const getRamSummary = (pc: PCState) => {
        const sticks = pc.ram?.sticks || [];
        const totalRam = sticks.reduce((acc, stick) => acc + (stick?.capacity || 0), 0);
        const usedSlots = sticks.filter(s => s !== null).length;
        return `${totalRam}GB ${pc.ram?.type || 'Unknown'} (${usedSlots}/${pc.ram?.totalSlots || 0} slots)`;
    };
    const getStorageSummary = (pc: PCState) => {
        return pc.storage
            .filter(slot => slot.disk !== null)
            .map(slot => `${slot.disk?.capacity}GB ${slot.type}`)
            .join(', ');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                            <th className="px-6 py-4">Modèle</th>
                            <th className="px-6 py-4">Spécifications</th>
                            <th className="px-6 py-4">Prix</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pcs.map((pc) => (
                            <tr key={pc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-slate-800">{pc.brand} {pc.model}</p>
                                        <p className="text-xs text-slate-500">{pc.year}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-600">
                                        <p>{pc.processor}</p>
                                        <p className="text-xs text-slate-400">
                                            {getRamSummary(pc)} • {getStorageSummary(pc)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-slate-800">€{pc.price}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={clsx(
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            pc.status === 'available'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                        )}
                                    >
                                        {pc.status === 'available' ? 'Disponible' : 'Vendu'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(pc)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Voir Détails"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {!readonly && (
                                            <>
                                                <button
                                                    onClick={() => onEdit(pc)}
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(pc.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pcs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Aucun PC trouvé dans l'inventaire.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
