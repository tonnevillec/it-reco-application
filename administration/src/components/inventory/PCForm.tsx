import React, { useState, useEffect } from 'react';
import type { PCState, RamConfig, RamStick, StorageSlot, StorageDisk, PCScreen, Donor, Part } from '../../types';
import { X, Trash2, HardDrive, Cpu, Monitor, Building2, Calendar, Hash, Wrench, Info, Image as ImageIcon, Plus } from 'lucide-react';
import { dataService } from '../../utils/dataService';

interface PCFormProps {
    initialData?: PCState | null;
    onSubmit: (data: Omit<PCState, 'id' | 'status' | 'upgrades'>) => void;
    onCancel: () => void;
}

export const PCForm: React.FC<PCFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'basic' | 'config' | 'announcement' | 'refurbishment' | 'photos'>('basic');
    const [donors, setDonors] = useState<Donor[]>([]);
    const [availableParts, setAvailableParts] = useState<Part[]>([]);
    const [pcTypes, setPcTypes] = useState<{ id: number; label: string }[]>([]);

    // Images
    const [images, setImages] = useState<string[]>([]);

    // Basic Info
    const [formData, setFormData] = useState({
        itRecoRef: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        donor: '', // IRI
        type: '', // IRI
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        condition: '',
        otherDetails: '',
        isActif: true,
    });

    // Specs
    const [processor, setProcessor] = useState('');
    const [gpu, setGpu] = useState('');

    // Screen (for Laptop)
    const [screen, setScreen] = useState<PCScreen>({
        size: 14,
        resolution: '1920x1080',
        type: 'IPS'
    });

    // RAM Configuration
    const [ramConfig, setRamConfig] = useState<RamConfig>({
        totalSlots: 2,
        type: 'DDR4',
        sticks: [null, null]
    });

    // Storage Configuration
    const [storageSlots, setStorageSlots] = useState<StorageSlot[]>([]);

    // Announcement
    const [announcement, setAnnouncement] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isOnline: false,
    });

    // Refurbishment
    const [refurbishment, setRefurbishment] = useState({
        initialState: '',
        details: '',
        partsUsed: [] as string[],
        photos: [] as { url: string; title: string }[],
    });

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                const [loadedDonors, loadedParts, loadedTypes] = await Promise.all([
                    dataService.getDonors(),
                    dataService.getParts(),
                    dataService.getPCTypes()
                ]);
                setDonors(loadedDonors);
                setAvailableParts(loadedParts);
                setPcTypes(loadedTypes.map(t => ({ id: t.id, label: t.label })));
            } catch (error) {
                console.error('Failed to load dependencies', error);
            }
        };
        loadDependencies();

        if (initialData) {
            setFormData({
                itRecoRef: initialData.itRecoRef || '',
                purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0],
                donor: initialData.donor || '',
                type: initialData.type || '',
                brand: initialData.brand,
                model: initialData.model,
                year: initialData.year || new Date().getFullYear(),
                price: initialData.price,
                condition: initialData.pcCondition,
                otherDetails: initialData.otherDetails || '',
                isActif: initialData.isActif ?? true,
            });
            setProcessor(initialData.processor);
            setGpu(initialData.gpu || '');

            if (initialData.screen) {
                setScreen(initialData.screen);
            }

            setRamConfig(initialData.ram);
            setStorageSlots(initialData.storage);

            if (initialData.announcement) {
                setAnnouncement(initialData.announcement);
            }

            if (initialData.refurbishment) {
                setRefurbishment({
                    ...initialData.refurbishment,
                    photos: initialData.refurbishment.photos || []
                });
            }

            if (initialData.images) {
                setImages(initialData.images);
            }
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            itRecoRef: formData.itRecoRef.trim(),
            donor: formData.donor.trim(),
            type: formData.type.replace(/\s/g, ''),
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            pcCondition: formData.condition.trim(),
            otherDetails: formData.otherDetails.trim(),
            isActif: formData.isActif,
            processor: processor.trim(),
            gpu: gpu.trim(),
            ram: ramConfig,
            storage: storageSlots,
            screen: screen,
            announcement,
            refurbishment,
            parts: refurbishment.partsUsed.map(p => p.trim()),
            images,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const [newRefurbPhoto, setNewRefurbPhoto] = useState({ title: '', file: null as File | null });

    const handleRefurbPhotoUpload = () => {
        if (newRefurbPhoto.file && newRefurbPhoto.title) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRefurbishment({
                    ...refurbishment,
                    photos: [...(refurbishment.photos || []), {
                        url: reader.result as string,
                        title: newRefurbPhoto.title
                    }]
                });
                setNewRefurbPhoto({ title: '', file: null });
            };
            reader.readAsDataURL(newRefurbPhoto.file);
        }
    };

    // ... (RAM and Storage handlers remain same, just copied for completeness)
    const updateRamSlots = (count: number) => {
        const newSticks = [...ramConfig.sticks];
        if (count > newSticks.length) {
            for (let i = newSticks.length; i < count; i++) newSticks.push(null);
        } else {
            newSticks.length = count;
        }
        setRamConfig({ ...ramConfig, totalSlots: count, sticks: newSticks });
    };

    const updateRamStick = (index: number, stick: RamStick | null) => {
        const newSticks = [...ramConfig.sticks];
        newSticks[index] = stick;
        setRamConfig({ ...ramConfig, sticks: newSticks });
    };

    const addStorageSlot = (type: StorageSlot['type']) => {
        setStorageSlots([...storageSlots, { type, disk: null }]);
    };

    const removeStorageSlot = (index: number) => {
        setStorageSlots(storageSlots.filter((_, i) => i !== index));
    };

    const updateStorageDisk = (index: number, disk: StorageDisk | null) => {
        const newSlots = [...storageSlots];
        newSlots[index] = { ...newSlots[index], disk };
        setStorageSlots(newSlots);
    };

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? 'Modifier PC' : 'Ajouter un Nouveau PC'}
                </h2>
                {/* Close button handled by SplitView on mobile, hidden here */}
            </div>

            <div className="flex border-b border-slate-100 px-6">
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('basic')}
                >
                    Infos de Base
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'config' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('config')}
                >
                    Configuration
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'announcement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('announcement')}
                >
                    Annonce
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'refurbishment' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('refurbishment')}
                >
                    Reconditionnement
                </button>
                <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'photos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('photos')}
                >
                    Photos
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* New Fields */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Hash size={16} /> Référence IT-Reco
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.itRecoRef}
                                    onChange={e => setFormData({ ...formData, itRecoRef: e.target.value })}
                                    placeholder="IT-2023-XXX"
                                />
                            </div>

                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isActif ? 'bg-green-500' : 'bg-slate-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${formData.isActif ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.isActif}
                                        onChange={e => setFormData({ ...formData, isActif: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">Actif (Visible Boutique)</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Date d'Achat
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.purchaseDate}
                                    onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 size={16} /> Entreprise
                                </label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.donor}
                                    onChange={e => setFormData({ ...formData, donor: e.target.value })}
                                >
                                    <option value="">Sélectionner une entreprise...</option>
                                    {donors.map(d => (
                                        <option key={d.id} value={d['@id']}>{d.company || d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                <div className="flex gap-4 flex-wrap">
                                    {pcTypes.map(type => (
                                        <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value={`/api/p_c_types/${type.id}`}
                                                checked={formData.type === `/api/p_c_types/${type.id}`}
                                                onChange={() => setFormData({ ...formData, type: `/api/p_c_types/${type.id}` })}
                                                className="text-blue-600"
                                            />
                                            <span>{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Marque</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Modèle</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Année</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (€)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">État / Observations</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-24"
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="space-y-6">
                        {/* Processor Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Cpu size={18} /> Processeur
                            </h3>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={processor}
                                onChange={e => setProcessor(e.target.value)}
                                placeholder="ex: Intel Core i5-8250U"
                            />
                        </div>

                        {/* RAM Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Monitor size={18} /> Configuration RAM
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm"
                                        value={ramConfig.type}
                                        onChange={e => setRamConfig({ ...ramConfig, type: e.target.value })}
                                    >
                                        <option value="DDR3">DDR3</option>
                                        <option value="DDR4">DDR4</option>
                                        <option value="DDR5">DDR5</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Total Emplacements</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="8"
                                        className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm"
                                        value={ramConfig.totalSlots}
                                        onChange={e => updateRamSlots(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {ramConfig.sticks.map((stick, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-100">
                                        <span className="text-xs font-medium text-slate-400 w-12">Slot {idx + 1}</span>
                                        <div className="flex-1 flex gap-2">
                                            {stick ? (
                                                <>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            placeholder="Go"
                                                            className="w-16 px-2 py-1 rounded border border-slate-200 text-sm"
                                                            value={stick.capacity}
                                                            onChange={e => updateRamStick(idx, { ...stick, capacity: parseFloat(e.target.value) })}
                                                        />
                                                        <span className="text-sm text-slate-500">Go</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Marque"
                                                        className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm"
                                                        value={stick.brand || ''}
                                                        onChange={e => updateRamStick(idx, { ...stick, brand: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateRamStick(idx, null)}
                                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => updateRamStick(idx, { capacity: 0 })}
                                                    className="flex-1 text-left text-sm text-slate-400 hover:text-blue-600 border border-dashed border-slate-300 rounded px-2 py-1"
                                                >
                                                    + Installer Barrette RAM
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* GPU Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Monitor size={18} /> GPU
                            </h3>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={gpu}
                                onChange={e => setGpu(e.target.value)}
                                placeholder="ex: Intel UHD 620"
                            />
                        </div>

                        {/* Screen Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Monitor size={18} /> Détails Écran
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Taille (pouces)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm"
                                        value={screen.size}
                                        onChange={e => setScreen({ ...screen, size: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Résolution</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm"
                                        value={screen.resolution || ''}
                                        onChange={e => setScreen({ ...screen, resolution: e.target.value })}
                                        placeholder="1920x1080"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type/Desc</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 rounded border border-slate-200 text-sm"
                                        value={screen.type || ''}
                                        onChange={e => setScreen({ ...screen, type: e.target.value })}
                                        placeholder="IPS, 144Hz..."
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${screen.isTouch ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${screen.isTouch ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={screen.isTouch || false}
                                            onChange={e => setScreen({ ...screen, isTouch: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-slate-700">Tactile</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Storage Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                    <HardDrive size={18} /> Emplacements Stockage
                                </h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => addStorageSlot('M.2')} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">+ M.2</button>
                                    <button type="button" onClick={() => addStorageSlot('2.5"')} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">+ 2.5"</button>
                                    <button type="button" onClick={() => addStorageSlot('3.5"')} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">+ 3.5"</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {storageSlots.map((slot, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded border border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-500">{slot.type} Slot</span>
                                            <button type="button" onClick={() => removeStorageSlot(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                        </div>

                                        {slot.disk ? (
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="number"
                                                    placeholder="GB"
                                                    className="w-20 px-2 py-1 rounded border border-slate-200 text-sm"
                                                    value={slot.disk.capacity}
                                                    onChange={e => updateStorageDisk(idx, { ...slot.disk!, capacity: parseFloat(e.target.value) })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Marque"
                                                    className="w-24 px-2 py-1 rounded border border-slate-200 text-sm"
                                                    value={slot.disk.brand || ''}
                                                    onChange={e => updateStorageDisk(idx, { ...slot.disk!, brand: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm"
                                                    value={slot.disk.description || ''}
                                                    onChange={e => updateStorageDisk(idx, { ...slot.disk!, description: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateStorageDisk(idx, null)}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => updateStorageDisk(idx, { capacity: 0 })}
                                                className="w-full text-left text-sm text-slate-400 hover:text-blue-600 border border-dashed border-slate-300 rounded px-2 py-1"
                                            >
                                                + Installer Disque
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {storageSlots.length === 0 && (
                                    <p className="text-sm text-slate-400 italic text-center py-2">Aucun emplacement de stockage configuré.</p>
                                )}
                            </div>
                        </div>

                        {/* Other Details Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                                <Info size={18} /> Autre détail
                            </h3>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-24 bg-white"
                                value={formData.otherDetails}
                                onChange={e => setFormData({ ...formData, otherDetails: e.target.value })}
                                placeholder="Informations supplémentaires (ports, connectivité, etc.)"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'announcement' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={announcement.title}
                                onChange={e => setAnnouncement({ ...announcement, title: e.target.value })}
                                placeholder="ex: PC Portable Gamer Puissant - i7 16GB RAM"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-32"
                                value={announcement.description}
                                onChange={e => setAnnouncement({ ...announcement, description: e.target.value })}
                                placeholder="Description détaillée de l'article..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={announcement.date}
                                    onChange={e => setAnnouncement({ ...announcement, date: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${announcement.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${announcement.isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={announcement.isOnline}
                                        onChange={e => setAnnouncement({ ...announcement, isOnline: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">En ligne</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'refurbishment' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">État Initial</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-24"
                                value={refurbishment.initialState}
                                onChange={e => setRefurbishment({ ...refurbishment, initialState: e.target.value })}
                                placeholder="Décrivez l'état du PC à la réception..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Détails du Reconditionnement</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none h-32"
                                value={refurbishment.details}
                                onChange={e => setRefurbishment({ ...refurbishment, details: e.target.value })}
                                placeholder="Listez les travaux effectués sur le PC..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <Wrench size={16} /> Pièces Utilisées
                            </label>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-60 overflow-y-auto">
                                {availableParts.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic text-center">Aucune pièce disponible dans l'inventaire.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {availableParts.map(part => (
                                            <label key={part.id} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                    checked={refurbishment.partsUsed.includes(part.id)}
                                                    onChange={e => {
                                                        const newParts = e.target.checked
                                                            ? [...refurbishment.partsUsed, part.id]
                                                            : refurbishment.partsUsed.filter(id => id !== part.id);
                                                        setRefurbishment({ ...refurbishment, partsUsed: newParts });
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium text-slate-800">
                                                            {part.name} {part.brand && <span className="text-slate-500 font-normal">({part.brand})</span>}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{part.category}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <ImageIcon size={16} /> Photos du Reconditionnement
                            </label>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Titre de la photo</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 rounded border border-slate-200 text-sm"
                                            placeholder="Ex: Nettoyage ventilateur"
                                            value={newRefurbPhoto.title}
                                            onChange={e => setNewRefurbPhoto({ ...newRefurbPhoto, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Photo</label>
                                        <input
                                            type="file"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            accept="image/*"
                                            onChange={e => setNewRefurbPhoto({ ...newRefurbPhoto, file: e.target.files?.[0] || null })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRefurbPhotoUpload}
                                        disabled={!newRefurbPhoto.title || !newRefurbPhoto.file}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {refurbishment.photos?.map((photo, idx) => (
                                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video">
                                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                            <p className="text-white text-xs font-medium mb-2 text-center">{photo.title}</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPhotos = refurbishment.photos?.filter((_, i) => i !== idx);
                                                    setRefurbishment({ ...refurbishment, photos: newPhotos });
                                                }}
                                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'photos' && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <input
                                type="file"
                                id="pc-images"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="pc-images"
                                className="cursor-pointer inline-flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center">
                                    <Plus size={32} className="text-slate-400" />
                                </div>
                                <span className="font-medium">Ajouter une photo</span>
                                <span className="text-sm text-slate-400">JPG, PNG (Max 5Mo)</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                                    <img src={img} alt={`PC ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        #{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                        {initialData ? 'Enregistrer' : 'Ajouter PC'}
                    </button>
                </div>
            </form>
        </div>
    );
};
