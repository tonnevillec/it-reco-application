import type { PC, Donor, Part, Sale, User, GeneralInfo, PCTypeDefinition } from '../types';
import { MOCK_PCS, MOCK_DONORS, MOCK_PARTS, MOCK_SALES, MOCK_USERS, MOCK_GENERAL_INFO, MOCK_PC_TYPES } from '../data/mockData';

const STORAGE_KEYS = {
    PCS: 'it-reco-pcs',
    PARTS: 'it-reco-parts',
    SALES: 'it-reco-sales',
    DONORS: 'it-reco-donors',
};

export const loadPCs = (): PC[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PCS);
        if (!stored) return MOCK_PCS;

        const parsed = JSON.parse(stored);

        // Basic validation
        if (!Array.isArray(parsed)) return MOCK_PCS;

        if (parsed.length > 0) {
            const sample = parsed[0];
            // Check for new RAM structure
            if (!sample.ram || !Array.isArray(sample.ram.sticks)) {
                console.warn('Detected legacy data format (RAM). Resetting to mock data.');
                localStorage.setItem(STORAGE_KEYS.PCS, JSON.stringify(MOCK_PCS));
                return MOCK_PCS;
            }
            // Check for new Type field (migration check)
            if (!sample.type) {
                console.warn('Detected legacy data format (Missing Type). Migrating...');
                // Simple migration: default to 'Laptop' and copy screenSize to screen
                const migrated = parsed.map((pc: any) => ({
                    ...pc,
                    type: 'Laptop',
                    screen: { size: pc.screenSize || 14, resolution: '1920x1080', type: 'Unknown' },
                    itRecoRef: `MIG-${pc.id}`,
                    recoveryDate: new Date().toISOString().split('T')[0]
                }));
                localStorage.setItem(STORAGE_KEYS.PCS, JSON.stringify(migrated));
                return migrated;
            }
        }

        return parsed as PC[];
    } catch (error) {
        console.error('Error loading PCs:', error);
        return MOCK_PCS;
    }
};

export const savePCs = (pcs: PC[]) => {
    localStorage.setItem(STORAGE_KEYS.PCS, JSON.stringify(pcs));
};

export const loadDonors = (): Donor[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.DONORS);
        if (!stored) return MOCK_DONORS;
        return JSON.parse(stored) as Donor[];
    } catch (error) {
        console.error('Error loading Donors:', error);
        return MOCK_DONORS;
    }
};

export const saveDonors = (donors: Donor[]) => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
};

export const loadParts = (): Part[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PARTS);
        if (!stored) return MOCK_PARTS;
        return JSON.parse(stored) as Part[];
    } catch (error) {
        console.error('Error loading Parts:', error);
        return MOCK_PARTS;
    }
};

export const saveParts = (parts: Part[]) => {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
};

export const loadSales = (): Sale[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SALES);
        if (!stored) return MOCK_SALES;
        return JSON.parse(stored) as Sale[];
    } catch (error) {
        console.error('Error loading Sales:', error);
        return MOCK_SALES;
    }
};

export const saveSales = (sales: Sale[]) => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};

export const loadUsers = (): User[] => {
    try {
        const stored = localStorage.getItem('it-reco-users');
        if (!stored) return MOCK_USERS;
        return JSON.parse(stored) as User[];
    } catch (error) {
        console.error('Error loading Users:', error);
        return MOCK_USERS;
    }
};

export const saveUsers = (users: User[]) => {
    localStorage.setItem('it-reco-users', JSON.stringify(users));
};

export const loadGeneralInfo = (): GeneralInfo => {
    try {
        const stored = localStorage.getItem('it-reco-general-info');
        if (!stored) return MOCK_GENERAL_INFO;
        return JSON.parse(stored) as GeneralInfo;
    } catch (error) {
        console.error('Error loading General Info:', error);
        return MOCK_GENERAL_INFO;
    }
};

export const saveGeneralInfo = (info: GeneralInfo) => {
    localStorage.setItem('it-reco-general-info', JSON.stringify(info));
};

export const loadPCTypes = (): PCTypeDefinition[] => {
    try {
        const stored = localStorage.getItem('it-reco-pc-types');
        if (!stored) return MOCK_PC_TYPES;
        return JSON.parse(stored) as PCTypeDefinition[];
    } catch (error) {
        console.error('Error loading PC Types:', error);
        return MOCK_PC_TYPES;
    }
};

export const savePCTypes = (types: PCTypeDefinition[]) => {
    localStorage.setItem('it-reco-pc-types', JSON.stringify(types));
};
