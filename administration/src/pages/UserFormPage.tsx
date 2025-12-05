import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '../components/users/UserForm';
import { dataService } from '../utils/dataService';
import type { User } from '../types';
import { ArrowLeft } from 'lucide-react';

export const UserFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (id) {
                try {
                    const user = await dataService.getUser(id);
                    setUser(user);
                } catch (error) {
                    console.error('Error loading user:', error);
                    navigate('/users');
                }
            }
        };
        loadUser();
    }, [id, navigate]);

    const handleSubmit = async (userData: Omit<User, 'id'>) => {
        try {
            if (id) {
                await dataService.updateUser(id, userData);
                toast.success('Utilisateur mis à jour avec succès');
            } else {
                await dataService.createUser(userData);
                toast.success('Utilisateur créé avec succès');
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Erreur lors de l\'enregistrement de l\'utilisateur.');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/users')}
                    className="text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Users</span>
                </button>
                <h1 className="text-3xl font-bold text-slate-800">
                    {id ? 'Edit User' : 'Add New User'}
                </h1>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <UserForm
                    initialData={user}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/users')}
                />
            </div>
        </div>
    );
};
