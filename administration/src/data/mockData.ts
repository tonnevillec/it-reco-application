import type { PC, Donor, Part, Sale, User, GeneralInfo, PCTypeDefinition } from '../types';

export const MOCK_USERS: User[] = [
    { id: '1', username: 'admin', roles: ['ROLE_ADMIN'], password: 'password123' },
    { id: '2', username: 'user', roles: ['ROLE_USER'], password: 'user123' },
];

export const MOCK_DONORS: Donor[] = [
    {
        id: 'd1',
        name: 'TechCorp Solutions',
        contactName: 'John Doe',
        contactEmail: 'john@techcorp.com',
        siret: '123 456 789 00012',
        address: '123 Tech Avenue, Silicon Valley',
        documents: [
            { id: 'doc1', name: 'Donation_Receipt_2023.pdf', dateAdded: '2023-10-15' }
        ]
    },
    {
        id: 'd2',
        name: 'Local University',
        contactName: 'Jane Smith',
        contactEmail: 'jane.smith@uni.edu',
        documents: []
    }
];

export const MOCK_GENERAL_INFO: GeneralInfo = {
    heroText: 'Welcome to IT Reco, your partner for refurbished IT equipment.',
    alertMessage: 'We will be closed for holidays from Dec 24th to Jan 2nd.',
    siret: '123 456 789 00012',
    telephone: '+33 6 12 34 56 78',
    email: 'contact@it-reco.fr',
    leboncoinUrl: 'https://www.leboncoin.fr/profile/user/12345',
    linkedinUrl: 'https://www.linkedin.com/company/it-reco',
    legalMentions: '<h1>Mentions Légales</h1><p>Editeur du site : IT Reco...</p>',
    legalUpdateDate: new Date().toISOString().split('T')[0],
    documents: [],
    news: []
};

export const MOCK_PC_TYPES: PCTypeDefinition[] = [
    { id: 'laptop', label: 'Laptop' },
    { id: 'tower', label: 'Tower' },
    { id: 'server', label: 'Server' },
    { id: 'other', label: 'Other' }
];

export const MOCK_PARTS: Part[] = [
    {
        id: '1',
        name: 'Samsung 8GB DDR4',
        type: 'RAM',
        price: 25,
        specifications: '2400MHz SODIMM'
    },
    {
        id: '2',
        name: 'Crucial 500GB SSD',
        type: 'Storage',
        price: 45,
        specifications: '2.5" SATA III'
    },
    {
        id: '3',
        name: 'Intel AX200',
        type: 'Other',
        price: 15,
        specifications: 'Wi-Fi 6 + BT 5.0'
    },
];

export const MOCK_PCS: PC[] = [
    {
        id: 'pc1',
        itRecoRef: 'IT-2023-001',
        recoveryDate: '2023-10-01',
        donorId: 'd1',
        type: 'Laptop',
        brand: 'Dell',
        model: 'Latitude 5490',
        year: 2018,
        processor: 'Intel Core i5-8350U',
        ram: {
            totalSlots: 2,
            type: 'DDR4',
            sticks: [
                { capacity: 8, frequency: '2400MHz', brand: 'SK Hynix' },
                null
            ]
        },
        storage: [
            {
                type: 'M.2',
                disk: { capacity: 256, brand: 'Samsung', description: 'PM981 NVMe' }
            },
        ],
        gpu: 'Intel UHD Graphics 620',
        screen: { size: 14, resolution: '1920x1080', type: 'IPS' },
        screenSize: 14,
        conditionObservation: 'Good condition, minor scratches on lid.',
        upgrades: [],
        price: 350,
        status: 'available',
    },
    {
        id: 'pc2',
        itRecoRef: 'IT-2023-002',
        recoveryDate: '2023-10-05',
        donorId: 'd2',
        type: 'Laptop',
        brand: 'Lenovo',
        model: 'ThinkPad T480',
        year: 2018,
        processor: 'Intel Core i7-8550U',
        ram: {
            totalSlots: 2,
            type: 'DDR4',
            sticks: [
                { capacity: 8, frequency: '2400MHz', brand: 'Samsung' },
                { capacity: 8, frequency: '2400MHz', brand: 'Samsung' }
            ]
        },
        storage: [
            {
                type: 'M.2',
                disk: { capacity: 512, brand: 'Intel', description: '660p NVMe' }
            },
            {
                type: '2.5"',
                disk: null // Empty slot
            }
        ],
        gpu: 'Intel UHD Graphics 620',
        screen: { size: 14, resolution: '1920x1080', type: 'IPS' },
        screenSize: 14,
        conditionObservation: 'Excellent condition.',
        upgrades: [],
        price: 450,
        status: 'available',
    },
];

export const MOCK_SALES: Sale[] = [];
