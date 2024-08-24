import React, { useContext, useEffect, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Each } from '../Each';
import AuthContext from '../../context/AuthContext';
import { MessageLeft, MessageRight } from '../chat/Message';

const RoomChat = (props) => {
    const { chat_id } = props

    const [chat, setChat] = useState(null);
    const axios = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get('/chats/chat', { params: chat_id });
                setChat(resp.data);
                console.log(resp.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    const messageViewRef = useRef(null);
    useEffect(() => {
        //3️⃣ bring the last item into view        
        messageViewRef.current?.lastElementChild?.scrollIntoView()
    }, [chat]);

    return (
        <div className='m-1 max-h-full min-h-full overflow-y-hidden'>
            <div className='bg-green-900 rounded-xl overflow-y-auto mb-1 pb-2' ref={messageViewRef}>
                {
                    chat &&
                    <Each of={chat.messages} render={(message, index) =>
                        message.sender.username !== user.username ?
                            <MessageLeft message={message}/>
                            :
                            <MessageRight message={message} />
                    } />
                }
            </div>
            <div className='max-h-10 h-10 min-h-10 bottom-0 flex p-1 mb-2'>
                <input type='text' className='rounded-md w-full p-2'/>
                <button className='text-white shadow-inner shadow-white hover:bg-green-700 w-24 ms-2'>Send</button>
            </div>
        </div>
    )
}

export default RoomChat