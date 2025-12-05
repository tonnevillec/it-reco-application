import React, { useEffect, useState } from 'react';
import backApiSerrevis from "../services/backApiSerrevis.jsx";

const HorairesSerreVisInformatique = () => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApiSerrevis.apiFetch('/api/horaires')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="w-full">
            <table className="w-full text-sm text-left text-slate-600">
                <tbody className="divide-y divide-slate-100">
                    {!loading && datas.map(d =>
                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 font-medium text-slate-900 pr-1 whitespace-nowrap">{d.jour}</td>
                            <td className="py-2 px-1 whitespace-nowrap">{d.matin}</td>
                            <td className="py-2 pl-1 whitespace-nowrap text-right">{d.apm}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HorairesSerreVisInformatique;