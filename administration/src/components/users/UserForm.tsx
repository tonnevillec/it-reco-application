import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../../types';
import { User as UserIcon, Lock, Shield } from 'lucide-react';

interface UserFormProps {
    initialData?: User | null;
    onSubmit: (data: Omit<User, 'id'>) => void;
    onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        role: 'user' as UserRole,
        password: '',
    });

    useEffect(() => {
        if (initialData) {
            const isAdmin = initialData.roles.includes('ROLE_ADMIN');
            setFormData({
                username: initialData.username,
                role: isAdmin ? 'admin' : 'user',
                password: '', // Don't populate password for security, only if changing
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = { ...formData };

        // Map password to plainPassword for API
        const apiData: any = {
            ...dataToSubmit,
            plainPassword: dataToSubmit.password
        };
        delete apiData.password;

        if (initialData && !apiData.plainPassword) {
            delete apiData.plainPassword;
        }

        // Convert role to roles array
        const finalData: any = {
            ...apiData,
            roles: apiData.role === 'admin' ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER']
        };
        delete finalData.role;

        onSubmit(finalData);
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Modifier Utilisateur' : 'Ajouter Nouvel Utilisateur'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <UserIcon size={16} /> Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            placeholder="jdoe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Shield size={16} /> Rôle
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={() => setFormData({ ...formData, role: 'user' })}
                                    className="text-blue-600"
                                />
                                <span>Utilisateur</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={() => setFormData({ ...formData, role: 'admin' })}
                                    className="text-blue-600"
                                />
                                <span>Administrateur</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Lock size={16} /> Mot de passe
                        </label>
                        <input
                            type="password"
                            required={!initialData} // Required only for new users
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder={initialData ? "Laisser vide pour conserver le mot de passe actuel" : "Entrez le mot de passe"}
                        />
                        {initialData && (
                            <p className="text-xs text-slate-500 mt-1">Entrez une valeur uniquement si vous souhaitez modifier le mot de passe.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        {initialData ? 'Enregistrer' : 'Créer Utilisateur'}
                    </button>
                </div>
            </form>
        </div>
    );
};
