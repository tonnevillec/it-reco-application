import React, {useState} from 'react';
import Stars from "../../components/Stars.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPeace} from "@fortawesome/free-solid-svg-icons";

const BoutiqueCard = ({id, datas}) => {
    const [currentImage, setCurrentImage] = useState(datas.images[0])
    const showModal = (e) => {
        e.preventDefault()
        const dialog = document.getElementById(e.currentTarget.getAttribute('data-id'));
        dialog.showModal()
    }

    function stars(){
        let r = []

        for (let i = 0; i < datas.etiqStars; i++){
            r.push({pos: i, value: 1})
        }
        for (let j = datas.etiqStars; j < 5; j++){
            r.push({pos: j, value: 0})
        }
        return <>
            {r.map(star => <Stars state={star.value} key={star.pos} />)}
        </>;
    }

    return (
        <div className="card bg-base-100 w-full shadow-xl border border-slate-300 rounded-none">
            <div className={"w-full p-1 text-start flex gap-2"}>
                {datas.etiquettes.map(e =>
                    <span key={e.id} className={`badge badge-${e.couleur} rounded-none ${e.textColor}`}>
                        {e.title}
                        {e.couleur === 'primary' && <FontAwesomeIcon icon={faHandPeace} className={"ms-2"}></FontAwesomeIcon>}
                    </span>
                )}
            </div>

            <figure className="px-4 min-h-[350px]">
                <img
                    src={datas.images[0].lien}
                    alt={datas.images[0].alt}
                    data-id={`boutique-card-${datas.images[0].id}`}
                    onClick={showModal}
                    className={"cursor-pointer max-h-[350px]"}
                />
            </figure>

            <dialog id={`boutique-card-${datas.images[0].id}`} className={"modal px-4"}>
                <div className={"modal-box p-4 m-4 min-w-full xl:min-w-[75%] min-h-[90%]"}>
                    <div className="flex flex-wrap">
                        <div className={"lg:w-1/2 w-full flex flex-col"}>
                            <div className="w-full flex justify-center items-start">
                                <figure className={"w-96 h-96"}>
                                    <img alt={currentImage.title}
                                         className="object-cover object-center"
                                         src={currentImage.lien}/>
                                </figure>
                            </div>

                            <div className={"w-full flex flex-row gap-4 p-4"}>
                                {datas.images.map(i =>
                                    <figure className="cursor-pointer object-cover h-36 w-36" key={i.id}>
                                        <img
                                            src={i.lien}
                                            alt={id.title}
                                            className={"h-36 w-36"}
                                            onClick={() => setCurrentImage(i)}
                                        />
                                    </figure>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 px-4 lg:px-6">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">{datas.categorie}</h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{datas.title}</h1>

                            <div className="flex mb-4">
                              <span className="flex items-center">
                                  {stars()}
                                <span className="text-gray-600 ml-3">{datas.etiquettes[0].title}</span>
                              </span>
                            </div>

                            <p className={"w-full leading-relaxed my-4"}
                                 dangerouslySetInnerHTML={{__html: datas.description}}/>

                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-gray-900">{datas.price} €</span>
                                {/*<button*/}
                                {/*    className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button*/}
                                {/*</button>*/}
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

                    <span className={"w-full text-xl"}>{datas.price} €</span>

                    <div className={"w-full text-start text-sm mb-2"}
                         dangerouslySetInnerHTML={{__html: datas.shortDesc}}/>
                </div>

                <div className="card-actions">
                    <button type={"button"}
                            className={"btn btn-primary btn-sm mt-2"}
                            data-id={`boutique-card-${datas.images[0].id}`}
                            onClick={showModal}>
                        Fiche produit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoutiqueCard;