import React, { useContext, useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Each } from './Each';
import def_img from '../assets/default.jpg';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavBar = () => {

    const { user, logoutUser } = useContext(AuthContext);

    const navigationItems = [
        { title: 'Home', href: '/home', activeClassName: 'bg-gray-900 text-white', passiveClassName: 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', current: true },
        { title: 'Dashboard', href: '/home', activeClassName: 'bg-gray-900 text-white', passiveClassName: 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', current: false },
    ];

    const dropdownItems = [
        { title: 'Home', href: '/home', className: 'block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100' },
        { title: 'Logout', onClick: logoutUser, className: 'block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100' },
    ];

    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        navigationItems.forEach((item) => {
            if (item.href === pathname) item.current = true;
            else item.current = false;
        });
    }, [location]);

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-14 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            {/* Logo */}
                            <img
                                alt="Musichat"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            {/* Navigation buttons */}
                            <div className="flex space-x-4">
                                <Each of={navigationItems} render={(item, index) =>
                                    <a
                                        key={item.title}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={item.current ? item.activeClassName : item.passiveClassName}
                                    >
                                        {item.title}
                                    </a>
                                } />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            {/* Profile Image */}
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <img
                                    alt="User Image"
                                    src={def_img}
                                    className="h-8 w-8 rounded-full"
                                />
                            </MenuButton>
                            {/* Dropdown Items */}
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <div className='text-xs'>
                                    <p>Username</p>
                                    <p>usermail</p>
                                </div>
                                <hr />
                                <Each of={dropdownItems} render={(item, index) =>
                                    <MenuItem>
                                        <a href={item.href && item.href}
                                            onClick={item.onClick && item.onClick}
                                            className={item.className}>
                                            {item.title}
                                        </a>
                                    </MenuItem>
                                } />

                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Each of={navigationItems} render={(item, index) =>
                        <DisclosureButton
                            as='a'
                            key={item.title}
                            href={item.href && item.href}
                            onClick={item.onClick && item.onClick}
                            aria-current={item.current ? 'page' : undefined}
                            className={item.className}
                        >
                            {item.title}
                        </DisclosureButton>
                    } />
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}

export default NavBar