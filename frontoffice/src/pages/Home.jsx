import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import Landing from "./Landing.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import backApi from "../services/backApi.jsx";

const Home = () => {
    const location = useLocation()
    const [datas, setDatas] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/general_infos/1')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
            {!loading && <Navbar logo={datas.logoUrl} />}

            <main className="flex-grow pt-20">
                {location.pathname === "/" ? <Landing /> : <Outlet />}
            </main>

            {!loading &&
                <Footer logo={datas.logoUrl}
                    contact={datas.contactEmail}
                    linkedin={datas.linkedinUrl}
                    siret={datas.siret}
                />
            }

            <div className="bg-white border-t border-slate-100 py-6 text-center text-sm text-slate-500">
                <p>Copyright © {new Date().getFullYear()} IT Reco - Tous droits réservés</p>
            </div>
        </div>
    );
};

export default Home;