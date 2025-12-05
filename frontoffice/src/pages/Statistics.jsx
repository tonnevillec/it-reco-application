import React, {useEffect, useState} from 'react';
import backApi from "../services/backApi.jsx";

const Statistics = () => {
    const [datas, setDatas] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/api/statistic')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row w-full gap-4">
            {!loading && datas.map(d =>
                <div className="p-6 w-full sm:w-1/4 text-center border border-primary rounded-xl hover:bg-slate-100" key={d.id}>
                    <h2 className="title-font font-medium sm:text-4xl text-3xl text-gray-900">{d.value}</h2>
                    <p className="leading-relaxed">{d.title}</p>
                </div>
            )}
        </div>
    );
};

export default Statistics;