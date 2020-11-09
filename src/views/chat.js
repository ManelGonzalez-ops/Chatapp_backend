import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client"
import "../styles.css";
import Cookie from "js-cookie"

export default function Chat(props) {

  const [msg, setMsg] = useState([])
  const [sentMsg, setSentMsg] = useState("")
  const [currentRoom, setCurrentRoom] = useState("")
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState("")
  const inputa = useRef(null)
  const [scrollH, setScrolH] = useState(0)
  const connection = socketIOClient("https://chattabackend.herokuapp.com/")
 


  useEffect(() => {
  
    const user = Cookie.getJSON("user")
    const {room} = props.match.params
    setCurrentRoom(room)
    setCurrentUser(user)
    connection.emit("JoinRoom", { username: user, room: room })
    connection.on("message", message => {
      setMsg(prev => [...prev, message])
      setScrolH(document.querySelector(".chat-messages").scrollHeight)
    })
    connection.on("users", dbUsers=>{
      setUsers(dbUsers)
    })

    //important to close connection on dismount
    return ()=>{
      connection.close()
    }
  }, [])

//if we want that a user could be in more than one room at a time we should pass room name as well, and rooms cookie should be an array



const scrolla = useRef(null)

const sendMessage=(e)=>{
  e.preventDefault()
  // const container = document.querySelector(".chat-messages")
 
  console.log("HOOOOLA MARIKA")
 
  connection.emit("chatMessage", {username: currentUser, msg: sentMsg})
  setSentMsg("") 
}

useEffect(()=>{
  document.querySelector(".chat-messages").scrollTop = scrollH
}
,[scrollH])


  const leaveRoom =()=>{
    props.history.push("/")
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1><i className="fas fa-smile"></i> Chatta</h1>
        <button id="leave" className="btn" 
        onClick={leaveRoom}
        >Leave Room</button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3><i className="fas fa-comments"></i> Room Name:</h3>
  <h2 id="room-name">{currentRoom}</h2>
          <h3><i className="fas fa-users"></i> Users</h3>
          <ul id="users">
  {users.map(user=><li>{user.name}</li>)}
          </ul>
        </div>
        <div className="chat-messages">
          {msg && msg.map(item =>{
            let clase = ""
            switch(item.user){
              case currentUser:
                clase = "message self"
                break
              case "Admin":
                clase = "message admin"
                break
              default:
                clase = "message"
                break
            }
            return <div className={clase}><p className="meta">{item.user}&nbsp;
            <span>{item.time}</span></p>
              <p className="text">{item.text}</p>
              </div>
          } )}
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={sendMessage}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autocomplete="off"
            value={sentMsg}
            ref={inputa}
            onChange={(e)=>{setSentMsg(e.target.value)}}
          />
          <button className="btn" type="submit"><i className="fas fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </div>
  );
}
