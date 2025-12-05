import BoutiquePreview from "./BoutiquePreview.jsx";
import DisclaimerBoutique from "./DisclaimerBoutique.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Boutique = ({ leboncoin }) => {
    return (
        <section className="body-font min-h-64 bg-slate-50 py-24" id={"section-boutique"}>
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Boutique</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                    </div>
                    <Link to={'/store'} className="btn btn-ghost text-slate-600 hover:text-primary-600 hover:bg-primary-50 group">
                        Voir tous les produits <FontAwesomeIcon icon={faShop} className="ml-2 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                <DisclaimerBoutique />

                <BoutiquePreview leboncoin={leboncoin} />
            </div>
        </section>
    );
};

export default Boutique;