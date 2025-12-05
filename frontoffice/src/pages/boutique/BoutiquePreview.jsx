import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import backApi from "../../services/backApi.jsx";
import StoreCard from "../store/StoreCard.jsx";

const BoutiquePreview = ({ leboncoin }) => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))

        setLoading(false)
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/p_cs?page=1&itemsPerPage=4&isActif=true')
            console.log(d)
            const mappedData = (d['member'] || []).map(pc => ({
                id: pc.id,
                title: pc.announcement?.title || `${pc.brand} ${pc.model}`,
                photos: (pc.images || []).map((img, idx) => ({ id: idx, src: img })),
                sticker: pc.type?.name || 'PC',
                promotion: null,
                isAvailable: pc.status.toUpperCase() === 'AVAILABLE',
                refItReco: pc.itRecoRef,
                codeProduit: pc.model,
                price: pc.price,
            }))
            setDatas(mappedData)
        } catch (error) {
            console.error(error)
        }
    }

    return (<>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 w-full">
            {!loading && datas.map(d =>
                <StoreCard item={d} key={d.id} />
            )}
        </div>

        {(typeof leboncoin !== 'undefined' && leboncoin !== null && leboncoin !== '') &&
            <div className="flex w-full justify-center mt-12">
                <a href={leboncoin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-4 text-lg font-bold text-white text-center transition-all duration-300 bg-gradient-to-r from-[#ff6e14] to-[#f55b02] rounded-full shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <span className="text-center">Visiter la boutique sur Leboncoin</span>
                    <FontAwesomeIcon icon={faExternalLink} className="ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
            </div>
        }
    </>
    );
};

export default BoutiquePreview;