import React, { useEffect, useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { Each } from '../Each';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';

const RoomSettings = (props) => {
    const axios = useAxios();
    const { roomKey } = props;
    const [roomSettings, setRoomSettings] = useState(null);
    const [editOn, setEditOn] = useState(false);
    const [maxusersErrorMessage, setMaxusersErrorMessage] = useState([]);

    const labelClassName = "text-sm font-medium leading-6 text-black";
    const errorStateClassName = "font-mono font-semibold text-red-500 motion-safe:animate-pulse";

    const formProps = [
        { name: 'max_users', type: 'number', label: 'Max. Users:', errorState: maxusersErrorMessage, errorSetState: setMaxusersErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'is_public', type: 'checkbox', label: 'Is Public:' },
        { name: 'allow_messages', type: 'checkbox', label: 'Allow Messages:' }
    ]

    useEffect(() => {
        axios.get('/rooms/room/settings', { params: { key: roomKey } }).then((resp) => {
            const response = resp.data;
            setRoomSettings(response);
        });
    }, [roomKey]);

    const handeSettingsUpdate = (e) => {
        e.preventDefault();

        const max_users = e.target.max_users.value;
        const is_public = e.target.is_public.checked;
        const allow_messages = e.target.allow_messages.checked;

        const formData = new FormData();
        formData.append('key', roomKey)
        formData.append('max_users', max_users);
        formData.append('is_public', is_public);
        formData.append('allow_messages', allow_messages);

        axios.put('/rooms/room/settings/update', formData).then((resp) => {
            if (resp.data.error) {
                setMaxusersErrorMessage(resp.data.error);
            } else {
                setMaxusersErrorMessage(null);
                setRoomSettings(resp.data.settings);
                setEditOn(false);
            }
        });
    };

    const handleFormCancel = (e) => {
        e.preventDefault();
        setMaxusersErrorMessage(null);
        setEditOn(false);
    }

    return (
        <>
            <div className='flex justify-between mx-2'>
                <h4>Settings</h4>
                <button className='text-black p-1' onClick={() => setEditOn(!editOn)}>
                    <Cog8ToothIcon aria-hidden="true" className="block h-4 w-4 group-data-[open]:hidden" />
                </button>
            </div>
            {!editOn ?
                roomSettings &&
                <div>
                    <Each of={formProps} render={(item, index) =>
                        <div className='mt-2'>
                            <label htmlFor={item.name + "-form"} className={labelClassName}>
                                {item.label}
                            </label>{" "}
                            <input
                                id={item.name + "-val"}
                                type={item.type}
                                className={item.type === 'text' ? textInputClassName : ""}
                                value={roomSettings[item.name]}
                                checked={roomSettings[item.name]}
                                contentEditable={false}
                                readOnly={true}
                            />
                        </div>
                    } />
                </div>
                :
                roomSettings &&
                <form onSubmit={handeSettingsUpdate} >
                    <Each of={formProps} render={(item, index) =>
                        <div className='mt-2' key={item.name}>
                            <label htmlFor={item.name + "-form"} className={labelClassName}>
                                {item.label}
                            </label>{" "}
                            <input
                                id={item.name + "-form"}
                                name={item.name}
                                type={item.type}
                                className={item.type === 'text' ? textInputClassName : ""}
                                defaultValue={roomSettings[item.name]}
                                defaultChecked={roomSettings[item.name]}
                            />
                            {item.errorState &&
                                <ul id={item.name + "-form-error"} className={item.errorState !== "" ? errorStateClassName : ""}>
                                    <li>{item.errorState}</li>
                                </ul>
                            }
                        </div>
                    } />
                    <div className='flex justify-around'>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500">
                            Update
                        </button>
                        <button onClick={handleFormCancel}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500">
                            Cancel
                        </button>
                    </div>
                </form>
            }
        </>
    )
}

export default RoomSettings