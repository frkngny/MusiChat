import React, { useContext, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Modal, Box } from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { Each } from '../Each';

const RoomCreate = (props) => {

    const { user } = useContext(AuthContext);
    const { open, closeCallback } = props

    const [maxusersErrorMessage, setMaxusersErrorMessage] = useState([]);

    const refs = {
        max_users_ref: useRef('max_users-ref'),
        is_public_ref: useRef('is_public-ref'),
        allow_messages_ref: useRef('allow_messages-ref'),
    }
    const formProps = [
        { name: 'max_users', type: 'number', label: 'Max. Users', ref: refs.max_users_ref, errorState: maxusersErrorMessage, errorSetState: setMaxusersErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'is_public', type: 'checkbox', label: 'Is Public', ref: refs.is_public_ref },
        { name: 'allow_messages', type: 'checkbox', label: 'Allow Messages', ref: refs.allow_messages_ref },
    ]

    const labelClassName = "text-sm font-medium leading-6 text-white"
    const textInputClassName = "w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2";
    const errorStateClassName = "font-mono font-semibold text-red-500 motion-safe:animate-pulse";
    const modalBoxClassName = 'absolute z-10 translate-x-1/2 translate-y-1/2 size-2/5 bg-black shadow-inner shadow-white p-6 justify-center self-center';

    const axios = useAxios();

    const fetchData = async (x) => {
        try {
            const resp = await axios.post('/rooms/create', {
                json: x,
            });
            console.log(resp);
            /**
             * @todo: navigate to created room.
             */
            closeCallback();
        } catch (error) {
            console.log(error);
        }
    }

    

    const handleClick = (e) => {
        let creationForm = {};
        for (var formRef in refs) {
            var current = refs[formRef].current;
            var val;
            if(current.type === 'checkbox')
                val = current.checked;
            else
                val = current.value;
            creationForm[current.name] = val;
            
        }
        fetchData(creationForm);
    };

    return (
        <Modal
            open={open}
            onClose={closeCallback}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box className={modalBoxClassName}>
                <Each of={formProps} render={(item, index) =>
                    <div className='mt-2'>
                        <label htmlFor={item.name + "-form"} className={labelClassName}>
                            {item.label}
                        </label>{" "}
                        <input
                            id={item.name + "-form"}
                            ref={item.ref}
                            name={item.name}
                            type={item.type}
                            className={item.type === 'text' ? textInputClassName : ""}
                            placeholder={item.type === 'text' ? item.label : ""}
                        />
                        <ul id={item.name + "-form-error"} className={item.errorState !== "" ? errorStateClassName : ""}>
                            {item.errorState &&
                                item.errorState.map((listItem) => (
                                    <li>{listItem}</li>
                                ))
                            }
                        </ul>
                    </div>
                } />
                <button
                    type="submit"
                    className="w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                    onClick={handleClick}
                >
                    Create
                </button>

            </Box>
        </Modal>
    )
}

export default RoomCreate