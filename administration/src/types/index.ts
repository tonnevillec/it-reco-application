export type UserRole = 'admin' | 'user';

export interface ApiResource {
    '@id'?: string;
    '@type'?: string;
}

export interface User extends ApiResource {
    id: string;
    username: string;
    roles: string[];
    password?: string;
}

export type PartType = 'RAM' | 'Storage' | 'GPU' | 'Other';

export interface Part extends ApiResource {
    id: string;
    name: string;
    category: string;
    brand?: string;
    purchasePrice?: number;
    sellingPrice?: number;
    specifications?: string;
    seller?: string;
    purchaseDate?: string;
    status?: string;
    invoice?: {
        fileName: string;
        fileUrl: string;
    } | null;
    isStock?: boolean;
    stockQuantity?: number;
    pc?: string; // IRI
    sale?: string; // IRI
}

export interface RamStick {
    capacity: number; // in GB
    brand?: string;
}

export interface RamConfig {
    totalSlots: number;
    type: string; // e.g., DDR4
    sticks: (RamStick | null)[]; // null means empty slot
}

export interface StorageDisk {
    brand?: string;
    capacity: number; // in GB
    description?: string; // e.g., "Samsung 970 EVO"
}

export interface StorageSlot {
    type: 'M.2' | '2.5"' | '3.5"';
    disk: StorageDisk | null; // null means empty slot
}

export interface DonorDocument {
    id: string;
    name: string;
    dateAdded: string;
    fileName: string;
    fileUrl: string;
}

export interface Donor extends ApiResource {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    siret?: string;
    documents: DonorDocument[];
}

export type PCType = string;

export interface PCTypeDefinition extends ApiResource {
    id: number;
    label: string;
    code: string;
}

export interface PCScreen {
    size: number;
    resolution?: string; // e.g. "1920x1080"
    type?: string; // e.g. "IPS", "TN"
    isTouch?: boolean;
}

export interface PC extends ApiResource {
    id: string;
    itRecoRef?: string;
    type: string; // IRI to PCType
    status: string; // AVAILABLE, SOLD, REFURBISHING, ARCHIVED
    model: string;
    brand: string;
    processor: string;
    ram: string; // JSON string in DB
    storage: string; // JSON string in DB
    gpu?: string;
    screen?: string; // JSON string in DB
    pcCondition: string;
    donor?: string; // IRI to Donor
    purchaseDate?: string;
    year?: number;
    price: number;
    comments?: string;
    otherDetails?: string;
    images?: string[]; // JSON array in DB
    parts: string[]; // Array of IRIs
    refurbishment?: {
        initialState: string;
        details: string;
        partsUsed: string[];
        photos?: {
            url: string;
            title: string;
        }[];
    };
    announcement?: {
        title: string;
        description: string;
        date: string;
        isOnline: boolean;
    };
    isActif?: boolean;
}

export interface Sale extends ApiResource {
    id: string;
    date: string;
    customerName: string;
    customerEmail?: string;
    totalAmount: number;
    paymentMethod: string;
    invoiceNumber: string;
    salesChannel?: 'Site' | 'Leboncoin' | 'Serre-Vi informatique';
    pcs: (string | PC)[]; // Array of IRIs or PC objects
    parts: string[]; // Array of IRIs
}

export interface GeneralInfo extends ApiResource {
    id: number;
    companyName?: string;
    siret?: string;
    address?: string;
    contactEmail?: string;
    logoUrl?: string;
    heroText?: string;
    legalMentions?: string;
    alertMessage?: string;
    telephone?: string;
    leboncoinUrl?: string;
    linkedinUrl?: string;
    documents?: Document[];
    news?: NewsItem[];
    legalUpdateDate?: string;
}

export interface Document {
    id: string;
    name: string;
    date: string;
    fileUrl: string;
    fileName: string;
}

export interface NewsItem {
    id: string;
    title: string;
    photo: string;
    description: string;
    active: boolean;
    date: string;
}

// Helper types for frontend state (decoded JSON)
export interface PCState extends Omit<PC, 'ram' | 'storage' | 'screen'> {
    ram: RamConfig;
    storage: StorageSlot[];
    screen?: PCScreen;
}
