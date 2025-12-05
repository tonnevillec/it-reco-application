import React from 'react';
import type { Part } from '../../types';
import { Edit, Trash2, Package } from 'lucide-react';

interface PartListProps {
    parts: Part[];
    onEdit: (part: Part) => void;
    onDelete: (id: string) => void;
    readonly?: boolean;
}

export const PartList: React.FC<PartListProps> = ({ parts, onEdit, onDelete, readonly = false }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                            <th className="px-6 py-3 w-[40%]">Détails de la Pièce</th>
                            <th className="px-6 py-3 w-[25%]">Type</th>
                            <th className="px-6 py-3 w-[15%] text-right">Prix</th>
                            {!readonly && <th className="px-6 py-3 w-[20%] text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {parts.map((part) => (
                            <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{part.name}</p>
                                            {part.brand && (
                                                <p className="text-xs font-medium text-blue-600">{part.brand}</p>
                                            )}
                                            <p className="text-xs text-slate-500">{part.specifications}</p>
                                            {part.seller && (
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    De : {part.seller} {part.purchaseDate && `(${new Date(part.purchaseDate).toLocaleDateString()})`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                                        {part.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-bold text-slate-800">€{part.purchasePrice}</span>
                                </td>
                                {!readonly && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(part)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(part.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {parts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    Aucune pièce trouvée dans l'inventaire.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
