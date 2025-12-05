import React, {useEffect, useState} from 'react';
import backApi from "../services/backApi.jsx";
import Select from "react-select";

const MultiSelect = ({id, name, label, onChange, selectedValue, endpoint}) => {
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatas()
            .finally(() => setLoading(false))
    }, [])

    const fetchDatas = async () => {
        try {
            const d = await backApi.apiFetch(endpoint);
            setDatas(d)
        } catch (error) {
            console.error(error)
        }
    }

    const customStyles = {
        control: base => ({
            ...base,
            fontSize: '0.9em',
            minHeight: 0
        }),
        clearIndicator: base => ({...base, paddingTop: 0, paddingBottom: 0}),
        dropdownIndicator: base => ({...base, paddingTop: 0, paddingBottom: 0}),
    }

    return (
        <fieldset className={"fieldset mb-4"}>
            <legend className="fieldset-legend">{label}</legend>

            {!loading &&
                <Select isMulti
                        name={name}
                        id={id}
                        options={datas}
                        closeMenuOnSelect={false}
                        onChange={onChange}
                        value={selectedValue.filter(d => d.value)}
                        className={"basic-multi-select"}
                        styles={customStyles}
                        isClearable
                />
            }
        </fieldset>
    );
};

export default MultiSelect;