import React, { useContext, useEffect, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Each } from '../Each';
import AuthContext from '../../context/AuthContext';
import { MessageLeft, MessageRight } from '../chat/Message';
import useSocket from '../../hooks/useSocket';

const RoomChat = (props) => {
    const { chat_id, roomKey } = props

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const axios = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        try {
            axios.get('/chats/chat', { params: chat_id }).then((resp) => {
                setChat(resp.data);
                setMessages(resp.data.messages);
            });
        } catch (error) {
            console.log(error);
        }
    }, [roomKey])

    // websocket
    if (socket === null) {
        setSocket(useSocket(`/chat/${roomKey}`));
    }
    else {
        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            if (data.type === 'chat_message') {
                setMessages([...messages, data.message]);
            }
        }
        window.addEventListener('pagehide', (event) => {
            if (event.persisted === false) {
                // client is gone
                socket.close();
            }
        });
    }


    // Scroll to the last message automatically
    const messageViewRef = useRef(null);
    useEffect(() => {
        messageViewRef.current?.lastElementChild?.scrollIntoView()
    }, [messages]);

    // send message
    const sendMessage = async (e) => {
        e.preventDefault();
        const messageForm = new FormData();
        let text = e.target.messageText.value;
        if (text !== "") {
            messageForm.append('chat', chat.id)
            messageForm.append('text', text);
            messageForm.append('sender', user.user_id);
            await axios.post('/chats/chat/send-message', messageForm);
        }
        e.target.messageText.value = "";
    }

    return (
        <>
            <div className='m-1 flex-1 overflow-y-auto max-h-[90%] mb-2'>
                <div className='bg-green-900 rounded-r-xl overflow-y-auto flex flex-col space-y-1' ref={messageViewRef}>
                    {
                        messages &&
                        <Each of={messages} render={(message, index) =>
                            message.sender.username !== user.username ?
                                <MessageLeft message={message} />
                                :
                                <MessageRight message={message} />
                        } />
                    }
                </div>
            </div>
            <div className='w-full m-auto flex-1'>
                <form onSubmit={sendMessage}>
                    <input type='text' className='rounded-md p-2 w-[90%]' id='message-text' name='messageText' />
                    <button type='submit' className='text-white shadow-inner shadow-white hover:bg-green-700 w-[8%] h-8 ms-2' >Send</button>
                </form>
            </div>
        </>
    )
}

export default RoomChat