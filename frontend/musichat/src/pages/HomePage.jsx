import { useState } from "react";
import { PublicRooms } from "../components/homepage/PublicRooms";
import RoomCreate from "../components/rooms/RoomCreate";

const HomePage = () => {
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    const openRoomCreateModal = () => setOpenCreateRoomModal(true);
    const closeRoomCreateModal = () => setOpenCreateRoomModal(false);

    return (
        <div>
            <button onClick={() => openRoomCreateModal()}>Create Room</button>
            {
                openCreateRoomModal &&
                <RoomCreate open={openCreateRoomModal} closeCallback={() => closeRoomCreateModal()} />
            }

            <div className='w-fit flex-1 m-2 outline-dashed outline-1 upto-bottom overflow-y-auto '>
                <div className='sticky top-0 bg-gray-800 text-white text-center'>Public rooms</div>
                <PublicRooms />
            </div>
        </div>
    )
}
export default HomePage;