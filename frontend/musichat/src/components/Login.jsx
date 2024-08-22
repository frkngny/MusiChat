import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Each } from './Each';

function Login() {

    const { loginUser } = useContext(AuthContext);

    const [usernameErrorMessage, setUsernameErrorMessage] = useState([]);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState([]);

    const formProps = [
        { name: 'username', type: 'username', label: 'Username', errorState: usernameErrorMessage, errorSetState: setUsernameErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'password', type: 'password', label: 'Password', errorState: passwordErrorMessage, errorSetState: setPasswordErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
    ]

    const labelClassName = "text-sm font-medium leading-6 text-white"
    const textInputClassName = "w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2";
    const errorStateClassName = "font-mono font-semibold text-red-500 motion-safe:animate-pulse";

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        username.length > 0 && loginUser(username, password);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <Each of={formProps} render={(item, index) =>
                    <div className='mt-2'>
                        <label htmlFor={item.name + "-form"} className={labelClassName}>
                            {item.label}
                        </label>
                        <input
                            id={item.name + "-form"}
                            name={item.name}
                            type={item.type}
                            required
                            autoComplete={item.type}
                            className={textInputClassName}
                            placeholder={item.label}
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
                >
                    Login
                </button>
            </form>

        </>
    )
}

export default Login;