import React, { useState, Fragment } from "react";
import { IoSend } from "react-icons/io5";


const MessageInput = ({ onSend }) => {
  // const params = useParams();
  const [messageInput, setMessageInput] = useState("");
  // console.log(params.id);
  

  const sendHandler = (e) => {
    
    e.preventDefault(); // 🔥 stops page reload
    if (!messageInput.trim()) return;
    // console.log("MessageInput:", messageInput);
    onSend(messageInput); // 👈 send to parent
    setMessageInput(""); // clear input
  };

  return (
    <Fragment>
      <form onSubmit={sendHandler}>
        <div className="w-full flex items-center rounded-lg p-2 bg-gray-800">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-white px-2 py-1"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            className="text-blue-400 hover:text-blue-600"
          >
            <IoSend size={24} />
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default MessageInput;
