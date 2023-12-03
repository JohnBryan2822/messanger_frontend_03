import React from 'react';

const Message = ({ message, isMine }) => {
    return (
        <div className={`message ${isMine ? 'my-message' : 'other-message'}`}>
            {message.text}
        </div>
    );
};

export default Message;
