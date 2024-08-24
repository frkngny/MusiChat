import Login from "../components/Login"
import Register from "../components/Register"
import { useState } from "react"
import ReactCardflip from 'react-card-flip'


const MainPage = () => {

    const [isToLogin, setisToLogin] = useState(false);

    return (
        <>
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="w-1/3 h-1/3">
                    <ReactCardflip isFlipped={isToLogin}
                        flipDirection="horizontal"
                        flipSpeedBackToFront={1}>
                        <div className='rounded-md flex justify-center bg-green-700'>
                            <Login />
                        </div>
                        <div className='rounded-md flex justify-center bg-black'>
                            <Register />
                        </div>
                    </ReactCardflip>

                    <button type="submit"
                        className="bg-white flex mt-1 p-1
                        text-black font-bold
                        border rounded-md border-solid border-lime-700
                        shadow-inner shadow-green-700"
                        onClick={() => setisToLogin(!isToLogin)}>
                        {isToLogin ? "We have met before 😇" : "I am new here 🙄"}
                    </button>
                </div>
            </div>
        </>

    )
}

export default MainPage;