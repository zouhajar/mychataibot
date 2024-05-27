import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if(!message) return;
    setIsTyping(true);
    scrollTo(0,1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");


    fetch("http://localhost:1520/", {
      method: "post",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      msgs.push(data.output);
      setChats(msgs);
      setIsTyping(false);
      scrollTo(0, 1e10);
    })
    .catch((error) => console.error(error));

  };

  return (
    <main>
      <h1>ChatBot</h1>
      <section>
        {
          chats && chats.length ? 
            chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user-msg" : ""}>
                <span>{chat.role}</span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
           : "" 
        }
      </section>
      
      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "" : "hide"}</i>
        </p>
      </div>
      

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message and hit enter"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>

    </main>
  );
}

export default App;