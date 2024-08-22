import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Each } from './Each';


function Register() {

    const { registerUser } = useContext(AuthContext);

    const [emailErrorMessage, setEmailErrorMessage] = useState([]);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState([]);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState([]);
    const [password2ErrorMessage, setPassword2ErrorMessage] = useState([]);

    const formProps = [
        { name: 'email', type: 'email', label: 'Email address', errorState: emailErrorMessage, errorSetState: setEmailErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'username', type: 'username', label: 'Username', errorState: usernameErrorMessage, errorSetState: setUsernameErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'password', type: 'password', label: 'Password', errorState: passwordErrorMessage, errorSetState: setPasswordErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' },
        { name: 'password2', type: 'password', label: 'Confirm Password', errorState: password2ErrorMessage, errorSetState: setPassword2ErrorMessage, className: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2' }
    ]

    const labelClassName = "text-sm font-medium leading-6 text-white"
    const textInputClassName = "w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2";
    const errorStateClassName = "font-mono font-semibold text-red-500 motion-safe:animate-pulse";

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const password2 = e.target.password2.value;

        setEmailErrorMessage([]);
        setUsernameErrorMessage([]);
        setPasswordErrorMessage([]);
        setPassword2ErrorMessage([]);
        let errorMessage = registerUser(email, username, password, password2);
        errorMessage.then((err) => {
            for (var elm of Object.keys(err)) {
                const errorElement = formProps.find((element) => element.name == elm);
                errorElement.errorSetState(err[elm]);
            }
        })
    };

    return (

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
                Sign Up
            </button>
        </form>

    )
}

export default Register;