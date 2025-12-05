
import { api } from './api';
import type {
    PCTypeDefinition,
    Donor,
    Part,
    Sale,
    PC,
    User,
    GeneralInfo,
    PCState
} from '../types';

// Helper to parse JSON fields from API
const parsePC = (pc: PC): PCState => {
    return {
        ...pc,
        ram: typeof pc.ram === 'string' ? JSON.parse(pc.ram) : pc.ram,
        storage: typeof pc.storage === 'string' ? JSON.parse(pc.storage) : pc.storage,
        screen: pc.screen && typeof pc.screen === 'string' ? JSON.parse(pc.screen) : pc.screen,
        images: pc.images || [],
        year: pc.year,
        refurbishment: pc.refurbishment || { initialState: '', details: '', partsUsed: [] },
        announcement: pc.announcement || { title: '', description: '', date: '', isOnline: false },
    };
};

// Helper to stringify fields for API
const preparePCForSave = (pc: Partial<PCState>): Partial<PC> => {
    const data: any = { ...pc };
    if (pc.ram) data.ram = JSON.stringify(pc.ram);
    if (pc.storage) data.storage = JSON.stringify(pc.storage);
    if (pc.screen) data.screen = pc.screen;
    if (pc.year) data.year = pc.year;

    // Map refurbishment.partsUsed to parts (IRIs)
    if (pc.refurbishment && pc.refurbishment.partsUsed) {
        data.parts = pc.refurbishment.partsUsed.map((id: string) => `/api/parts/${id}`);
    }

    return data;
};

export const dataService = {
    // PCs
    getPCs: async (): Promise<PCState[]> => {
        const response = await api.get<{ 'hydra:member'?: PC[], 'member'?: PC[] }>('/p_cs');
        return (response['hydra:member'] || response['member'] || []).map(parsePC);
    },
    getPC: async (id: string): Promise<PCState> => {
        const pc = await api.get<PC>(`/p_cs/${id}`);
        return parsePC(pc);
    },
    createPC: async (pc: Partial<PCState>): Promise<PCState> => {
        const data = preparePCForSave(pc);
        const response = await api.post<PC>('/p_cs', data);
        return parsePC(response);
    },
    updatePC: async (id: string, pc: Partial<PCState>): Promise<PCState> => {
        const data = preparePCForSave(pc);
        const response = await api.patch<PC>(`/p_cs/${id}`, data);
        return parsePC(response);
    },
    deletePC: async (id: string): Promise<void> => {
        await api.delete(`/p_cs/${id}`);
    },

    // Donors
    getDonors: async (): Promise<Donor[]> => {
        const response = await api.get<{ 'hydra:member'?: Donor[], 'member'?: Donor[] }>('/donors');
        return response['hydra:member'] || response['member'] || [];
    },
    getDonor: async (id: string): Promise<Donor> => {
        return api.get<Donor>(`/donors/${id}`);
    },
    createDonor: async (donor: Omit<Donor, 'id'>): Promise<Donor> => {
        return api.post<Donor>('/donors', donor);
    },
    updateDonor: async (id: string, donor: Partial<Donor>): Promise<Donor> => {
        return api.put<Donor>(`/donors/${id}`, donor);
    },
    deleteDonor: async (id: string): Promise<void> => {
        await api.delete(`/donors/${id}`);
    },

    // Parts
    getParts: async (): Promise<Part[]> => {
        const response = await api.get<{ 'hydra:member'?: Part[], 'member'?: Part[] }>('/parts');
        return response['hydra:member'] || response['member'] || [];
    },
    getPart: async (id: string): Promise<Part> => {
        return api.get<Part>(`/parts/${id}`);
    },
    createPart: async (part: Omit<Part, 'id'>): Promise<Part> => {
        return api.post<Part>('/parts', part);
    },
    updatePart: async (id: string, part: Partial<Part>): Promise<Part> => {
        return api.put<Part>(`/parts/${id}`, part);
    },
    deletePart: async (id: string): Promise<void> => {
        await api.delete(`/parts/${id}`);
    },

    // Sales
    getSales: async (): Promise<Sale[]> => {
        const response = await api.get<{ 'hydra:member'?: Sale[], 'member'?: Sale[] }>('/sales');
        return response['hydra:member'] || response['member'] || [];
    },
    createSale: async (sale: Omit<Sale, 'id'>): Promise<Sale> => {
        return api.post<Sale>('/sales', sale);
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const response = await api.get<{ 'hydra:member'?: User[], 'member'?: User[] }>('/users');
        return response['hydra:member'] || response['member'] || [];
    },
    getUser: async (id: string): Promise<User> => {
        return api.get<User>(`/users/${id}`);
    },
    createUser: async (user: Omit<User, 'id'>): Promise<User> => {
        return api.post<User>('/users', user);
    },
    updateUser: async (id: string, user: Partial<User>): Promise<User> => {
        return api.patch<User>(`/users/${id}`, user);
    },
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },

    // PC Types
    getPCTypes: async (): Promise<PCTypeDefinition[]> => {
        const response = await api.get<{ 'hydra:member'?: PCTypeDefinition[], 'member'?: PCTypeDefinition[] }>('/p_c_types');
        return response['hydra:member'] || response['member'] || [];
    },
    createPCType: async (type: Omit<PCTypeDefinition, 'id'>): Promise<PCTypeDefinition> => {
        return api.post<PCTypeDefinition>('/p_c_types', type);
    },
    updatePCType: async (id: number, type: Partial<PCTypeDefinition>): Promise<PCTypeDefinition> => {
        return api.put<PCTypeDefinition>(`/p_c_types/${id}`, type);
    },
    deletePCType: async (id: number): Promise<void> => {
        await api.delete(`/p_c_types/${id}`);
    },

    // General Info
    getGeneralInfo: async (): Promise<GeneralInfo | null> => {
        try {
            const data = await api.get<GeneralInfo>('/general_infos/1');
            if (data && data.legalUpdateDate) {
                data.legalUpdateDate = data.legalUpdateDate.split('T')[0];
            }
            return data;
        } catch (error) {
            return null;
        }
    },
    saveGeneralInfo: async (info: Partial<GeneralInfo>): Promise<GeneralInfo> => {
        const existing = await dataService.getGeneralInfo();
        // Remove read-only fields
        const { id, '@id': atId, '@context': atContext, '@type': atType, ...cleanInfo } = info as any;

        let response: GeneralInfo;
        if (existing) {
            response = await api.put<GeneralInfo>('/general_infos/1', cleanInfo);
        } else {
            response = await api.post<GeneralInfo>('/general_infos', cleanInfo);
        }

        if (response && response.legalUpdateDate) {
            response.legalUpdateDate = response.legalUpdateDate.split('T')[0];
        }
        return response;
    },
};
