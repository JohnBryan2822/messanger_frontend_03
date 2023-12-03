import React from 'react';
import { FaSearch, FaBars, FaEllipsisV, FaPaperPlane, FaRegSmile } from 'react-icons/fa';
import './HomePage.css'; // Updated CSS file for additional styling

const HomePage = () => {
    return (
        <div className="container-fluid homepage">
            <div className="row h-100">
                {/* Chat List Section */}
                <div className="col-md-4 col-lg-3 chat-list-section">
                    <div className="chat-list-header">
                        <button className="btn btn-light me-2"><FaBars /></button>
                        <input type="text" className="form-control" placeholder="Search" />
                    </div>
                    <div className="chat-list">
                        {/* Populate chat list items here */}
                    </div>
                </div>

                {/* Chat Window Section */}
                <div className="col-md-8 col-lg-9 chat-window-section">
                    <div className="chat-window-header">
                        <span className="username-title">Username</span>
                        <button className="btn btn-light me-2"><FaSearch /></button>
                        <button className="btn btn-light"><FaEllipsisV /></button>
                    </div>
                    <div className="chat-conversation">
                        {/* Messages will be displayed here */}
                    </div>
                    <div className="message-input-area">
                        <input type="text" className="form-control me-2" placeholder="Write a message..." />
                        <button className="btn btn-primary"><FaPaperPlane /></button>
                        <button className="btn btn-light"><FaRegSmile /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
