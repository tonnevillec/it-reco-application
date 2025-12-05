import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import StoreDetails from "./storeDetails.jsx";
import { useScrollToAnchor } from "../../hook/useScrollToAnchor.jsx";
import backApi from "../../services/backApi.jsx";
import StoreCard from "./StoreCard.jsx";
import Pagination from "../../components/Pagination.jsx";
import MultiSelect from "../../components/MultiSelect.jsx";
import DisclaimerBoutique from "../boutique/DisclaimerBoutique.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import InfoSerreVisInformatique from "../InfoSerreVisInformatique.jsx";

const Store = () => {
    const params = useParams();

    return (
        <div className="w-full pt-24 pb-12 bg-slate-50 min-h-screen" id='top'>
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Boutique</h1>
                        <div className="h-1.5 w-20 bg-primary-500 rounded-full"></div>
                    </div>
                    <Link to={'/'} className="btn btn-ghost text-slate-600 hover:text-primary-600 hover:bg-primary-50">
                        <FontAwesomeIcon icon={faHome} className="mr-2" /> Retour à l'accueil
                    </Link>
                </div>

                {params.id === "" || typeof params.id === 'undefined' ? <StoreSearch /> : <StoreDetails />}
            </div>
        </div>
    );
};

export default Store;

const StoreSearch = () => {
    useScrollToAnchor('top');
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    const [filteredDatas, setFilteredDatas] = useState([]);
    const [search, setSearch] = useState({
        search_word: '',
        search_categorie: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(parseInt('25'))

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        setLoading(true)

        if (datas.length > 0) {
            filterDatas()
        }
        setLoading(false)
    }, [search])

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/p_cs')
            const mappedData = (d['member'] || []).map(pc => ({
                id: pc.id,
                title: pc.announcement?.title || `${pc.brand} ${pc.model}`,
                description: pc.announcement?.description || '',
                photos: (pc.images || []).map((img, idx) => ({ id: idx, src: img })),
                sticker: { id: pc.type?.id, title: pc.type?.name || 'PC' },
                promotion: null,
                isAvailable: pc.status.toUpperCase() === 'AVAILABLE',
                refItReco: pc.itRecoRef,
                codeProduit: pc.model,
                price: pc.price,
                isActif: pc.isActif
            }));
            setDatas(mappedData)

            if (mappedData.length > 0) {
                setFilteredDatas(mappedData.filter(
                    r =>
                        (
                            r.title.toString().toLowerCase().includes(search.search_word.toString().toLowerCase()) ||
                            r.description.toString().toLowerCase().includes(search.search_word.toString().toLowerCase())
                        )
                        &&
                        (
                            search.search_categorie.length === 0 ||
                            search.search_categorie.filter(c => {
                                if ((r.sticker.id === c.id)) {
                                    return r;
                                }
                            }).length > 0
                        )
                        && r.isActif === true
                )
                )
            } else {
                setFilteredDatas([])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const filterDatas = () => {
        setFilteredDatas(datas.filter(
            r =>
                (
                    r.title.toString().toLowerCase().includes(search.search_word.toString().toLowerCase()) ||
                    r.description.toString().toLowerCase().includes(search.search_word.toString().toLowerCase())
                )
                &&
                (
                    search.search_categorie.length === 0 ||
                    search.search_categorie.filter(c => {
                        if ((r.sticker.id === c.id)) {
                            return r;
                        }
                    }).length > 0
                )
                && r.isActif === true
        )
        )
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.currentTarget

        setCurrentPage(1);

        setSearch({ ...search, [name]: value })
    }

    const handleMulti = (newValue, e) => {
        const r = []
        const { name } = e

        if (newValue.length > 0) {
            newValue.map(v => {
                r.push(v)
            })
        }

        setCurrentPage(1);

        setSearch({ ...search, [name]: r })
    }

    const handleReset = (e) => {
        e.preventDefault()

        setSearch({
            ...search,
            search_word: '',
            search_categorie: []
        })

        setCurrentPage(1);
    }

    const handlePerPage = ({ currentTarget }) => {
        setItemsPerPage(parseInt(currentTarget.value))
    }

    const paginated = Pagination.getData(filteredDatas, currentPage, itemsPerPage);

    return (
        <section className="w-full">
            <InfoSerreVisInformatique />

            <DisclaimerBoutique />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                <div className="w-full lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faFilter} className="text-primary-500" />
                            Filtres
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recherche</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Modèle, marque..."
                                        id="search_word"
                                        name="search_word"
                                        defaultValue={search.search_word}
                                        onChange={handleChange}
                                    />
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Catégories</label>
                                <MultiSelect
                                    id="search_categorie"
                                    name="search_categorie"
                                    label="Sélectionner..."
                                    onChange={handleMulti}
                                    selectedValue={search.search_categorie}
                                    endpoint='/api/categories'
                                    containerClass="w-full"
                                />
                            </div>

                            {(search.search_word !== '' || search.search_categorie.length !== 0) &&
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm w-full text-slate-600 hover:text-white hover:bg-slate-600"
                                    onClick={handleReset}
                                >
                                    Réinitialiser
                                </button>
                            }
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <label htmlFor="itemsPerPage" className="flex items-center justify-between text-sm text-slate-600">
                                <span>Afficher par page</span>
                                <select
                                    id="itemsPerPage"
                                    name="itemsPerPage"
                                    className="select select-bordered select-sm w-20"
                                    defaultValue={itemsPerPage}
                                    onChange={handlePerPage}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {(!loading && filteredDatas.length > 0) ? paginated.map(d =>
                            <StoreCard item={d} key={d.id} />
                        ) : (
                            !loading && (
                                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-slate-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-8">
                        {itemsPerPage < filteredDatas.length &&
                            <Pagination currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                length={filteredDatas.length}
                                onPageChanged={handlePageChange}
                            />
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}