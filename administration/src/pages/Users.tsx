import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserList } from '../components/users/UserList';
import { dataService } from '../utils/dataService';
import type { User } from '../types';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { canEdit } = useAuth();
    const isEditable = canEdit();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await dataService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await dataService.deleteUser(id);
                loadData();
                toast.success('Utilisateur supprimé avec succès');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Erreur lors de la suppression de l\'utilisateur.');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <UsersIcon className="text-blue-600" size={32} />
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez les utilisateurs du système et leurs rôles.</p>
                </div>
                {isEditable && (
                    <button
                        onClick={() => navigate('/users/new')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        Ajouter un Utilisateur
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher des utilisateurs..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <UserList
                        users={filteredUsers}
                        onEdit={(user) => navigate(`/users/${user.id}`)}
                        onDelete={handleDelete}
                        readonly={!isEditable}
                    />
                </div>
            </div>
        </div>
    );
};
