import { BACK_URL } from "../config.js";

const ALaUne = ({ alaUne }) => {

    const getImageSrc = (input) => {
        if (!input) return null;
        try {
            if (typeof input === 'string' && input.trim().startsWith('{')) {
                const parsed = JSON.parse(input);
                return parsed.src || parsed.url || input;
            }
            if (typeof input === 'object') {
                return input.src || input.url;
            }
        } catch (e) {
            return input;
        }
        return input;
    }

    if (alaUne.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" id="section-actualite">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Actualités</h2>
                    <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {alaUne.map(d => {
                        const imageSrc = getImageSrc(d.photo);
                        return (
                            <div key={d.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row h-full min-h-[500px]">
                                <div className="md:w-2/5 relative min-h-[250px] md:min-h-0">
                                    {(imageSrc && imageSrc.startsWith('data:')) && (
                                        <img
                                            src={imageSrc}
                                            alt={d.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
                                </div>
                                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{d.title}</h3>
                                    <div
                                        className="prose prose-slate prose-sm text-slate-600 mb-6"
                                        dangerouslySetInnerHTML={{ __html: d.description }}
                                    />
                                    <div className="mt-auto">
                                        {(imageSrc && imageSrc.startsWith('data:')) && (
                                            <a
                                                href={imageSrc}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 font-bold hover:text-primary-700 transition-colors inline-flex items-center gap-2 group"
                                            >
                                                Voir l'affiche
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ALaUne;