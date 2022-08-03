import React, { useEffect } from "react";
import { useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
  const [currMessage, setCurrMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currMessage !== "") {
        const date = new Date(Date.now());
        const messageData = {
            room: room,
            author: username,
            message: currMessage,
            time: date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        }

        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrMessage("");
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]);
    })
  }, [socket])

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
                return (
                    <div key={index} className="message" id={username === messageContent.author ? "other" : "you"}>
                        <div>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" value={currMessage} placeholder="Hey..." onChange={({target}) => setCurrMessage(target.value)} onKeyPress={(event) => event.key === "Enter" && sendMessage()}/>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
