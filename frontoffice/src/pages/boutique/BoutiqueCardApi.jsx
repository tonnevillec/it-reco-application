import React, {useState} from 'react';
import {BACK_URL} from "../../config.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

const BoutiqueCard = ({id, datas}) => {
    const [currentImage, setCurrentImage] = useState(datas.photos[0])
    const showModal = (e) => {
        e.preventDefault()
        const dialog = document.getElementById(e.currentTarget.getAttribute('data-id'));
        dialog.showModal()
    }

    const closeModal = (e) => {
        e.preventDefault()

        const dialog =  document.getElementById(e.currentTarget.getAttribute('data-id'));
        dialog.close();
    }

    return (
        <div className="card bg-base-100 w-full shadow-xl border border-slate-300 rounded-none">
            <div className={"w-full p-1 text-start flex gap-2"}>
                <span className={`badge badge-${datas.sticker.bgColor} rounded-none ${datas.sticker.textColor}`}>
                    {datas.sticker.title}
                </span>
            </div>

            <figure className="px-4 min-h-[350px]">
                <img
                    src={BACK_URL + '/uploads/images/' + datas.photos[0].src}
                    alt={datas.title}
                    data-id={`boutique-card-${datas.photos[0].id}`}
                    onClick={showModal}
                    className={"cursor-pointer max-h-[350px]"}
                />
            </figure>

            <dialog id={`boutique-card-${datas.photos[0].id}`} className={"modal px-4"}>
                <div className={"modal-box p-1 m-1 lg:p-4 lg:m-4 min-w-full xl:min-w-[75%] min-h-[90%]"}>
                    <div className={"w-full flex justify-end bg-white z-100 lg:hidden"}>
                        <button type={"button"}
                                className={"btn btn-xs btn-secondary me-4"}
                                data-id={`boutique-card-${datas.photos[0].id}`}
                                onClick={closeModal}>
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        </button>
                    </div>

                    <div className="flex flex-wrap">
                        <div className={"lg:w-1/2 w-full flex flex-col"}>
                            <div className="w-full flex justify-center items-start">
                                <figure className={"w-96 h-96"}>
                                    <img alt={currentImage.title}
                                         className="object-cover object-center"
                                         src={BACK_URL + '/uploads/images/' + currentImage.src}/>
                                </figure>
                            </div>

                            <div className={"w-full grid grid-cols-2 gap-2 p-1  lg:grid-cols-4 lg:gap-4 lg:p-4"}>
                                {datas.photos.map(i =>
                                    <figure className="cursor-pointer object-cover h-36 w-36" key={i.id}>
                                        <img
                                            src={BACK_URL + '/uploads/images/' + i.src}
                                            alt={id.title}
                                            className={"h-36 w-36"}
                                            onClick={() => setCurrentImage(i)}
                                        />
                                    </figure>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 px-4 lg:px-6">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">{datas.sticker.title}</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{datas.title}</h1>

                            <p className={"w-full leading-relaxed my-4"}
                               dangerouslySetInnerHTML={{__html: datas.description}}/>

                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-gray-900">{datas.price} € TTC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <div className="card-body items-center flex flex-col justify-between">
                <div className={"flex flex-col gap-4"}>
                    <h2 className="card-title">{datas.title}</h2>

                    <div className={"w-full text-xl"}>
                        <span className={`${(datas.promotion !== null && datas.promotion !== '') && 'line-through'}`}>{datas.price} € TTC</span>
                        {(datas.promotion !== null && datas.promotion !== '') && <span className={"ms-2 font-bold"}>{datas.promotion} € TTC</span>}
                    </div>
                </div>

                <div className="card-actions">
                    <button type={"button"}
                            className={"btn btn-primary btn-sm mt-2"}
                            data-id={`boutique-card-${datas.photos[0].id}`}
                            onClick={showModal}>
                        Fiche produit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoutiqueCard;