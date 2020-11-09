import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client"
import "../styles.css";
import Cookie from "js-cookie"
//import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg'
import ChatMsg from "../rehusable/ChatMsg"
import { useParams } from "react-router-dom";
export default function Chat({ avatarUrl, ...props }) {

  const [msg, setMsg] = useState([])
  const [msgArr, setMsgArr] = useState([])
  const [sentMsg, setSentMsg] = useState("")
  const [currentRoom, setCurrentRoom] = useState("")
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState("")
  const inputa = useRef(null)
  const [scrollH, setScrolH] = useState(0)
  const connection = socketIOClient("https://chattabackend.herokuapp.com/")
  //const connection = socketIOClient("http://localhost:8000/")

  const debounce = useRef(false)
  const { room } = useParams()

  useEffect(() => {

    const user = Cookie.getJSON("user")
    
    setCurrentRoom(room)
    setCurrentUser(user)
    connection.emit("JoinRoom", { username: user, room: room, avatarUrl })
    connection.on("message", message => {
      setMsg(prev => [...prev, message])
      setScrolH(document.querySelector(".chat-messages").scrollHeight)
    })
    connection.on("users", dbUsers => {
      setUsers(dbUsers)
    })


    //important to close connection on dismount
    return () => {
      connection.close()
    }
  }, [])

  //if we want that a user could be in more than one room at a time we should pass room name as well, and rooms cookie should be an array



  const scrolla = useRef(null)

  const sendMessage = (e) => {
    e.preventDefault()

    connection.emit("chatMessage", { username: currentUser, msg: sentMsg })
    setSentMsg("")
  }

  useEffect(() => {
    document.querySelector(".chat-messages").scrollTop = scrollH
  }
    , [scrollH])


  const leaveRoom = () => {
    props.history.push("/")
  }

  useEffect(() => {

    if (!debounce.current) {
      debounce.current = true

      if (msg.length > 1) {
        const lasttwo = msg.slice(-2)
        console.log(lasttwo, "last index")
        if (lasttwo[0].user === lasttwo[1].user) {

          setMsgArr(prev => {

            let [lastChatMsg] = prev.slice(-1)
            console.log(lasttwo[0], lasttwo[1], "lasttwos")
            console.log(JSON.parse(JSON.stringify(lastChatMsg)), "last")

            lastChatMsg = [...lastChatMsg, lasttwo[1]]
            console.log(JSON.parse(JSON.stringify(lastChatMsg)), "newlast")

            return [...prev.slice(0, prev.length - 1), lastChatMsg
            ]
          })
        }
        else {
          setMsgArr(prev => [...prev, [msg[msg.length - 1]]])
        }
      }
      else {
        if (msg.length === 1) {
          console.log(msg, "just before set state")
          setMsgArr(prev => [...prev, [msg[0]]])
          console.log(msgArr, "msgArr first iteration")
        }
      }
      debounce.current = false
    }

  }, [msg])
  console.log("rerender")
  console.log(msg)
  console.log(msgArr)
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
            {users.map(user => <li>{user.name}</li>)}
          </ul>
        </div>
        <div className="chat-messages">
          {msgArr && msgArr.length > 0 &&
            msgArr.map(itam =>
              <ChatMsg
                side={currentUser === itam[0].user ? "right" : "left"}
                avatar={itam[0].avatarUrl}
                messages={itam.map(itam => itam.text)}
              />)}
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
            onChange={(e) => { setSentMsg(e.target.value) }}
          />
          <button className="btn" type="submit"><i className="fas fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </div>
  );
}
