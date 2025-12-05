import React from "react";

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged, size}) => {
    const pagesCount = Math.ceil(length / itemsPerPage);
    let pages = [];
    const start = (currentPage * itemsPerPage - itemsPerPage) + 1;
    const end = start - 1 + itemsPerPage;

    const taille = size ? size : "btn-sm"

    if(pagesCount > 10) {
        const array1 = [1, 2, 3, 4]
        const array2 = [pagesCount-3, pagesCount-2, pagesCount-1, pagesCount]
        if(array1.includes(currentPage)){
            pages = [1, 2, 3, 4, 'XX1', pagesCount-1, pagesCount]
        } else if (array2.includes(currentPage)) {
            pages = [1, 2, 'XX1', pagesCount-3, pagesCount-2, pagesCount-1, pagesCount]
        } else {
            pages = [1, 2, 'XX1', currentPage-1, currentPage, currentPage+1, 'XX2', pagesCount-1, pagesCount]
        }
    } else {
        for(let i = 1; i <= pagesCount; i++) {
            pages.push(i)
        }
    }

    return (
        <>
            <div className="flex justify-center pe-2 mb-2">
                <span className={"text-sm font-medium"}>Résultats {start} à {end} sur {length}</span>
            </div>

            <div className="flex justify-center mb-3">
                <div className={"join"}>
                    <button className={`join-item btn ${taille} ${currentPage === 1 ? 'btn-disabled' : ''}`}
                            onClick={() => onPageChanged(currentPage - 1)}>&laquo;</button>

                    {pages.map(page => {
                        return (page === 'XX1' || page === 'XX2') ?
                            <button className={`join-item btn ${taille} btn-disabled`} key={page}>...</button>
                            :
                            <button className={`join-item btn ${taille} ${currentPage === page ? 'bg-tibelec-100 text-white' : ''}`} key={page} onClick={() => onPageChanged(page)}>{page}</button>
                        ;
                    })}

                    <button className={`join-item btn ${taille} ${currentPage === pagesCount ? 'btn-disabled' : ''}`}
                            onClick={() => onPageChanged(currentPage + 1)}>&raquo;</button>
                </div>
            </div>
        </>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}

export default Pagination;