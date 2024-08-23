import Login from "../components/Login"
import Register from "../components/Register"
import { useState } from "react";

const MainPage = () => {

    const [isToLogin, setisToLogin] = useState(true)

    const btnClickHandler = () => {
        setisToLogin(!isToLogin);
    }

    return (
        <>
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="w-1/4 h-1/4 ">
                    <div className='rounded-md flex justify-center bg-black'>
                        {isToLogin ? <Login /> : <Register />}
                    </div>

                    <button type="submit" className="bg-white flex mt-1 p-1 text-black border rounded-md border-solid border-lime-700 hover:shadow-inner hover:shadow-green-700" onClick={btnClickHandler}>
                        { isToLogin ? "I am new." : "Wait! I was here before." }
                    </button>
                </div>
            </div>
        </>

    )
}

export default MainPage;