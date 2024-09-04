import React, { useRef } from 'react'
import { Each } from './Each'

const Carousel = (props) => {
    const { children } = props;

    const carouselsRef = useRef(null); 
    const carouselTabsRef = useRef(null); 

    const tabStyles = {
        active: 'bg-green-500 text-white p-1 rounded-md',
        passive: 'bg-green-700 text-white p-1 rounded-md',
    }

    const changeDisplayedUsers = (ind) => {
        const carouselTabsChildren = carouselTabsRef.current.children;
        for (let child of carouselTabsChildren) {
            child.className = tabStyles.passive; 
            if (child.id === `tab-${ind}`){
                child.className = tabStyles.active; 
            }
        }
        const carouselChildren = carouselsRef.current.children;
        for (let child of carouselChildren) {
            child.hidden = true;
            if (child.id === `child-${ind}`){
                child.hidden = false;
            }
        }
    }
    return (
        <>
            <div className='h-[20%] space-x-1' ref={carouselTabsRef}>
                <Each of={children} render={(child, index) =>
                    <button id={`tab-${index}`} onClick={() => changeDisplayedUsers(index)}
                        className={index==0 ? tabStyles.active : tabStyles.passive}>
                        {child.props.title}
                    </button>
                } />
            </div>
            <div className='h-[80%]' ref={carouselsRef}>
                <Each of={children} render={(child, index) =>
                    <div id={`child-${index}`} hidden={index==0 ? false : true} className='duration-700 ease-in-out'>
                        {child}
                    </div>
                } />
            </div>
        </>
    )
}

export default Carousel