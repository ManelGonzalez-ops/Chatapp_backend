import React,{useEffect} from "react";

import "./styles.css";
import {HashRouter, Route, Switch} from "react-router-dom"
import Home from "./views/home"
import Chat from "./views/chat"


export default function App() {

  useEffect(()=>{

  },[])
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
      </Switch>
      <Switch>
        <Route exact path="/:room" component={Chat}/>
      </Switch>
   </HashRouter>
  )
}
