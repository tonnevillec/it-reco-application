import React from 'react';
import type { Donor } from '../../types';
import { Edit, Trash2, Building2, FileText, Mail } from 'lucide-react';

interface DonorListProps {
    donors: Donor[];
    onEdit: (donor: Donor) => void;
    onDelete: (id: string) => void;
    readonly?: boolean;
}

export const DonorList: React.FC<DonorListProps> = ({ donors = [], onEdit, onDelete, readonly = false }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
                <div key={donor.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{donor.company || donor.name}</h3>
                                <p className="text-xs text-slate-500">{donor.documents.length} documents</p>
                            </div>
                        </div>
                        {!readonly && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(donor)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(donor.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <span className="font-medium text-slate-700">{donor.name}</span>
                            {donor.company && <span className="text-slate-400">(Contact)</span>}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={14} className="text-slate-400" />
                            <a href={`mailto:${donor.email}`} className="hover:text-blue-600">{donor.email}</a>
                        </div>
                        {donor.siret && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <FileText size={14} className="text-slate-400" />
                                <span>SIRET: {donor.siret}</span>
                            </div>
                        )}
                        {donor.address && (
                            <div className="text-slate-500 text-xs mt-2 pl-6">
                                {donor.address}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {donors.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Aucune entreprise trouvée.
                </div>
            )}
        </div>
    );
};
