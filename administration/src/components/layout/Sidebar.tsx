import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, ShoppingCart, Users as UsersIcon, Settings, Monitor, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();

    const navGroups = [
        {
            title: null, // Top level items
            items: [
                { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' }
            ]
        },
        {
            title: 'Site',
            items: [
                { to: '/settings', icon: Settings, label: 'Infos Générales' }
            ]
        },
        {
            title: 'Gestion',
            items: [
                { to: '/donors', icon: Building2, label: 'Entreprises' },
                { to: '/types', icon: Monitor, label: 'Types de PC' },
                { to: '/parts', icon: Cpu, label: 'Stock Pièces' },
                { to: '/inventory', icon: Monitor, label: 'Inventaire PC' },
                { to: '/sales', icon: ShoppingCart, label: 'Ventes' }
            ]
        },
        {
            title: 'Administration',
            items: [
                { to: '/users', icon: UsersIcon, label: 'Utilisateurs' }
            ]
        }
    ];

    return (
        <div className="flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    IT Reco
                </h1>
                <p className="text-xs text-slate-400 mt-1">Gestionnaire de PC Reconditionnés</p>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-2">
                        {group.title && (
                            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm',
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        )
                                    }
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.username}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.roles.join(', ')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
};
