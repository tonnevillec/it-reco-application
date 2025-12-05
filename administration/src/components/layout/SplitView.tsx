import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface SplitViewProps {
    isOpen: boolean;
    onClose: () => void;
    mainContent: React.ReactNode;
    sideContent: React.ReactNode;
}

export const SplitView: React.FC<SplitViewProps> = ({ isOpen, onClose, mainContent, sideContent }) => {
    return (
        <div className="relative h-full flex overflow-hidden">
            {/* Main Content */}
            <div className={clsx(
                "flex-1 h-full transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "mr-0 lg:mr-[400px]" : "mr-0"
            )}>
                {mainContent}
            </div>

            {/* Side Panel (Drawer) */}
            <div className={clsx(
                "fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Close button for mobile or just general convenience */}
                    <div className="absolute top-4 right-4 z-10 lg:hidden">
                        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>
                    {sideContent}
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
        </div>
    );
};
