import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGears} from "@fortawesome/free-solid-svg-icons";
import backApi from "../services/backApi.jsx";

const MentionsLegales = () => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))

    }, []);

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch('/api/mentionsLegales')
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    const showModal = (e) => {
        e.preventDefault()

        const dialog = document.getElementById('mentions-legales');
        dialog.showModal();
    }

    return (
        <>
            <span className={"pt-3 cursor-pointer hover:font-bold"} onClick={showModal}>
                Mentions légales
            </span>

            {!loading &&
                <dialog id={"mentions-legales"} className={"modal"}>
                    <div className={"modal-box p-0 m-4 min-w-[80%] min-h-[80%]"}>
                        <div
                            className={"w-full p-2 bg-white border-solid border-t-0 border-l-0 border-r-0 border-2 border-slate-200 sticky top-0 z-100 font-bold"}>
                            <FontAwesomeIcon icon={faGears} className={"me-2"}></FontAwesomeIcon>Mentions légales
                        </div>

                        <div className={"py-4 px-8 text-justify"} dangerouslySetInnerHTML={{__html: datas.value}} />
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            }
        </>
    );
};

export default MentionsLegales;