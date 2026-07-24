import { useState , useEffect} from "react";
import {Routes, Route , Navigate} from "react-router";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import {authenticateUser} from "../src/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

function App(){
  const {isAuthenticate, loading, user}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(authenticateUser());
  },[])

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }

    return(
      <>
      <Routes>
        <Route path="/" element={isAuthenticate?<HomePage/>:<Navigate to={"/register"}/>}></Route>
        <Route path="/login" element={isAuthenticate?<Navigate to={"/"}/>:<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={isAuthenticate?<Navigate to={"/"}/>:<RegisterPage></RegisterPage>}></Route>
      </Routes>
      </>
    )
}

export default App;