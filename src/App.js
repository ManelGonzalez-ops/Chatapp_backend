import React,{useEffect, useState} from "react";

import "./styles.css";
import {HashRouter, Route, Switch} from "react-router-dom"
import Home from "./views/home"
import Chat from "./views/chat"
import Chato from "./views/chatv2"


export default function App() {
//esto ya no hace falta ya que tenemos que guardar los links en el servidor
const [avatarUrl, setAvatarUrl] = useState("") 
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Home setAvatarUrl={setAvatarUrl} />
          </Route>
      </Switch>
      <Switch>
        <Route exact path="/:room" >
          <Chato avatarUrl={avatarUrl} />
          </Route>
      </Switch>
   </HashRouter>
  )
}
