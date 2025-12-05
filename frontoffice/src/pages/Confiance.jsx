import React, { useEffect, useState } from 'react';
import backApi from "../services/backApi.jsx";
import { BACK_URL } from "../config.js";

const Confiance = () => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/api/donors')
            const mappedData = (d['member'] || []).map(donor => ({
                name: donor.company || donor.name,
                logo: donor.documents?.find(doc => doc.type === 'logo')?.url || 'default-logo.png', // Assuming logo is stored in documents or needs a specific field
                website: '' // Website field is missing in Donor entity, might need to be added or inferred
            }))
            // Filter out donors without logos if necessary, or just display all
            setDatas(mappedData)
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {datas.map(d => (
                <a
                    href={d.website ? `https://${d.website}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex justify-center p-4 transition-all duration-300 hover:-translate-y-1"
                    key={d.name}
                >
                    <img
                        src={`${BACK_URL}/uploads/images/${d.logo}`}
                        alt={d.name}
                        className="max-h-16 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                </a>
            ))}
        </div>
    );
};

export default Confiance;