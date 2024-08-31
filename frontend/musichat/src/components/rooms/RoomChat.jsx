import React, { useContext, useEffect, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Each } from '../Each';
import AuthContext from '../../context/AuthContext';
import { MessageLeft, MessageRight } from '../chat/Message';
import useSocket from '../../hooks/useSocket';

const RoomChat = (props) => {
    const { room, ...others } = props
    
    const axios = useAxios();
    const { user } = useContext(AuthContext);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [chatDisabled, setChatDisabled] = useState(true);

    useEffect(() => {
        if(room.allow_messages || user.user_id === room.host.id) {
            setChatDisabled(false);
        } else {
            setChatDisabled(true);
        }

        try {
            axios.get('/chats/chat', { params: room.chat }).then((resp) => {
                setChat(resp.data);
                setMessages(resp.data.messages);
            });
        } catch (error) {
            console.log(error);
        }
    }, [room])

    // websocket
    if (socket === null) {
        setSocket(useSocket(`/chat/${room.key}`));
    }
    else {
        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            if (data.type === 'chat_message') {
                setMessages([...messages, data.message]);
            }
        }
        onbeforeunload = (event) => { 
            socket.close();
        }
    }


    // Scroll to the last message automatically
    const messageViewRef = useRef(null);
    // useEffect(() => {
    //     messageViewRef.current?.lastElementChild?.scrollIntoView()
    // }, [messages]);

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
        <div className='h-full max-h-[90%] ms-2'>
            <div className='m-1  bg-green-900 rounded-r-xl max-h-[90%] mb-2 overflow-y-auto h-[88%]'>
                <div className='flex flex-col overflow-y-hidden space-y-1 mb-2' ref={messageViewRef}>
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
            <div className='w-full m-auto'>
                <form onSubmit={sendMessage}>
                    <input type='text' className='rounded-md p-2 w-[90%]' id='message-text' name='messageText' disabled={chatDisabled}/>
                    <button type='submit' className='text-white shadow-inner shadow-white hover:bg-green-700 w-[8%] h-8 ms-2' disabled={chatDisabled}>Send</button>
                </form>
            </div>
        </div>
    )
}

export default RoomChat