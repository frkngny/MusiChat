import { useState } from "react";
import { PublicRooms } from "../components/rooms/PublicRooms";
import RoomCreate from "../components/rooms/RoomCreate";



const HomePage = () => {
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    const openRoomCreateModal = () => setOpenCreateRoomModal(true);
    const closeRoomCreateModal = () => setOpenCreateRoomModal(false);

    return (
        <>
            <div>
                <button onClick={() => openRoomCreateModal()}>Create Room</button>
                {openCreateRoomModal &&
                    <RoomCreate open={openCreateRoomModal} closeCallback={() => closeRoomCreateModal()}/>}
                <p>Public rooms</p>
                <PublicRooms refresh={openCreateRoomModal}/>
            </div>
        </>
    )
}
export default HomePage;