import Avatar from "@mui/material/Avatar";


export const MessageLeft = (props) => {
    const { message } = props;
    return (
        <div className='flex justify-start m-0.5 ms-2'>
            <img
                className="h-6 w-6 m-1 rounded-full justify-center"
                src={message.sender.profile.image}
            />
            <div className="shrink">
                <div className='bg-gray-800 rounded-md p-1'>
                    <p className='text-white'>{message.text}</p>
                    {/* <div className={classes.messageTimeStampRight}>{timestamp}</div> */}
                </div>
                <div className='text-black text-xs'>{message.sender.username}</div>
            </div>
        </div>
    );
};

export const MessageRight = (props) => {
    const { message } = props
    return (
        <div className='flex justify-end m-0.5 me-4'>
            <div className='bg-black rounded-md p-1'>
                <p className='text-white'>{message.text}</p>
                {/* <div className={classes.messageTimeStampRight}>{timestamp}</div> */}
            </div>
        </div>
    );
};