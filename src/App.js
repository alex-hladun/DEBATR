 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import Slide from '@material-ui/core/Slide';
// import ReactDOM from 'react-dom';
import Stage from './components/stage/stage';
import SpectatorStage from './components/stage/SpectatorStage';
// import Rating from './components/partials/rating'
// import DiscreteSlider from './components/partials/slider'
// import UserCard from './components/user-card/userCard'
// import Dashboard from './components/dashboard/dashboard'
import Lobby from './components/lobby/lobby'
import NavBar from './components/nav/nav'
import PostDebate from './components/post-debate/postDebate'
import './components/partials/slider.css'
// import SocketContext from './SocketContext'
import socketIOClient from "socket.io-client";
// import SignUp from './components/sign-up/signUp';
// import CreateRoom from './components/create-room/createRoom';
import { useStore } from './Store'
import Disconnect from './components/disconnect/Disconnect';
import WaitingRoom from './components/waiting-room/waitingRoom';
import PastDebate from './components/past-debates/pastDebates'
const ENDPOINT = process.env.REACT_APP_HEROKU_URL;


// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const App = () => {
  const [state, dispatch] = useStore();
  const [roomState, setRoomState] = useState({})
  const [activeRoomState, setActiveRoomState] = useState({})
  const [setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    if (!state.sessionID) {
      const randUser = 'user' + (Math.random()*1000000).toFixed(0)
      dispatch({ type: 'SET_SESSION_ID', payload: randUser })
      // console.log("App -> randUser", randUser)
    }
  })
  
  useEffect(() => {
      axios.get(`/api/login/check`,  {})
        .then((res) => {
          if (res.data.success) {
            dispatch({ type: 'SET_USERNAME', payload: res.data.username })
            dispatch({ type: 'SET_USER_ID', payload: res.data.userID })
            dispatch({ type: 'SET_USER_AVATAR_URL', payload: res.data.userAvatarURL })
          }
          // console.log(res, 'res from persistent login check')
          return true
        })
        .catch((error) => {
          console.error(error, "error from axios request")
        })
    }, [dispatch])

  useEffect(() => {
    const socket = socketIOClient();
    dispatch({ type: 'SET_CURRENTSOCKET', payload: socket })
    // setCurrentSocket(socket)
    return () => socket.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (state.currentSocket) {
      state.currentSocket.on("initialRoomList", data => {
        const roomListParse = JSON.parse(data)
        setRoomState(prevState => ({ ...roomListParse }))
      })

      state.currentSocket.on('startGame', data => {
        fetch(`/video/token`, {
          method: 'POST',
          body: JSON.stringify({
            identity: state.username,
            room: state.currentRoom
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
          .then((fetchData) => {
            dispatch({ type: 'SET_VISUAL_MODE', payload: "ACTIVE" });
            dispatch({ type: 'SET_TOKEN', payload: fetchData.token })
          })
      })

      state.currentSocket.on('currentRoomUpdate', data => {
        // data to only update the current room state. 
        setActiveRoomState(prev => ({ ...prev, ...data }));
      })
    }

    // Cleanup function for socket listeners
    return (() => {
      if (state.currentSocket) {
        state.currentSocket.off('startGame')
        state.currentSocket.off('initialRoomList')
      }
    })
  }, [state.currentSocket, state.currentRoom, dispatch, state.username]);


  const lobby = (
    <main style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop:'50px', paddingTop:'25px' }}>
      {/* <Dashboard /> */}
      <Lobby roomState={roomState} />
      <h1 style={{ display: 'flex', 
      justifyContent: 'center', 
      border: 'solid 1px rgb(64,81,182)', 
      marginBottom: "20px", 
      color:'white', 
      backgroundColor:'rgb(64,81,182)',
      padding:'0px 10px' }}>Debate Results</h1>
      <span></span>
      <PastDebate />
    </main>
  )

  return (
    <div className="app" >
      <header style={{ 
            color: "white", 
            backgroundColor: "rgb(64,81,182)"
            }}>
        <NavBar handleClickOpen={handleClickOpen} handleClose={handleClose}/>
      </header>
      {state.visualMode === "ACTIVE" && state.token && <Stage activeRoomState={activeRoomState} />}
      {state.visualMode === "WAITING" && <WaitingRoom />}
      {state.visualMode === "LOBBY" && lobby}
      {state.visualMode === "GAME_OVER" && <PostDebate activeRoomState={activeRoomState} />}
      {state.visualMode === "CONNECTION_ERROR" && <Disconnect />}
      {state.visualMode === "SPECTATOR" && state.token && <SpectatorStage activeRoomState={activeRoomState}/>}
      <footer style={{ fontSize: "10px" }}>
        <p>
          Made with{' '}
          <span role="img" aria-label="React">
            ♥
          </span>{' '}
          and{' '}
          <span role="img" aria-label="React">
            ⚛️
          </span>{' '}
          by <p>AAA+</p>
        </p>
      </footer>
    </div>
  );
};

export default App;