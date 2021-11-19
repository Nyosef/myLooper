import './App.css';
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat,faGuitar,faDrumstickBite, faHandRock,faStar, faDrum, faTv, faRocket, faStoreSlash } from '@fortawesome/free-solid-svg-icons';

//Todo: Move this to a different json file
const loopSounds = [
  {
    keyCode: 81,
    key: 'Q',
    id: 'Future Beats',
    status: false,
    url: 'sounds/future_beats.mp3',
    imgClass: faHeartbeat
  },
  {
    keyCode: 87,
    key: 'W',
    id: 'Electric Guitar',
    status: false,
    url: 'sounds/electric_guitar_120.mp3',
    imgClass: faGuitar
  },
  {
    keyCode: 69,
    key: 'E',
    id: 'Groove',
    status: false,
    url: 'sounds/groove_120.mp3',
    imgClass: faDrumstickBite
  },
  {
    keyCode: 65,
    key: 'A',
    id: 'Heavy Funk',
    status: false,
    url: 'sounds/heavyfunk_120.mp3',
    imgClass: faRocket
  },
  {
    keyCode: 83,
    key: 'S',
    id: 'Maze Politics',
    status: false,
    url: 'sounds/mazepolitics_120.mp3',
    imgClass: faTv
  },
  {
    keyCode: 68,
    key: 'D',
    id: 'Pass Groove',
    status: false,
    url: 'sounds/passgroove.mp3',
    imgClass: faHandRock
  },
  {
    keyCode: 90,
    key: 'Z',
    id: 'Silent Star',
    status: false,
    url: 'sounds/silentstar_120.mp3',
    imgClass: faStar
  },
  {
    keyCode: 88,
    key: 'X',
    id: 'Stompy Slosh',
    status: false,
    url: 'sounds/stompyslosh_120.mp3',
    imgClass: faStoreSlash
  },
  {
    keyCode: 67,
    key: 'C',
    id: 'Stutter Breakbeats',
    status: false,
    url: 'sounds/stutter_breakbeats.mp3',
    imgClass: faDrum
  },
  {
    keyCode: 68,
    key: 'G',
    id: 'Nirs Beat',
    status: false,
    url: 'sounds/stutter_breakbeats.mp3',
    imgClass: faDrum
  }
];

{/* 
TYPE: Component
GOAL: represents smallest piece inside the PAD - each one represnts a sound/mp3 file.
*/}  

const PadKey = ({play ,sound: {key,url, keyCode, id, status , imgClass}}) => {
        // Allowing keyboard usage for the loop machine
      const handleKeydown = (event) => { 

        if(event.keyCode === keyCode){

          play(key,id, status);
        }

      };

      React.useEffect(() => {
        document.addEventListener("keydown",handleKeydown) 

      }, [key,id,status]);

          return (
            <button id={keyCode} className ="instrument" onClick={()=> { play(key, id, status)}}>
                  <audio loop className="clip" id={key} src={url} type="audio/mp3"></audio>
               
              <FontAwesomeIcon icon={imgClass}/>
              </button>
          );
}

{/* 
TYPE: Component
GOAL: Represents the pad which includes inside of it Padkeys. Each padkey represents a different sound.
*/}  

const Pad = ({power, play, sounds}) => {
    return(
      <div className="keyboard">
        {power 
        ? loopSounds.map((sound) =>  <PadKey play={play} sound={sound} sounds={sounds}/>)
        : loopSounds.map((sound) =>  <PadKey play={play} sound={{...sound, url:"#"}}/>)}
      </div>
    );
}

{/* 
TYPE: Component
GOAL: Controls the Pad, volume, shows data and more.
*/}  


const InstrumentControl = ({name, volume,power,stopLoops, handleVolumeChange}) => {

  return(
  <div className= "control">
    <button onClick={stopLoops}>Turn the power {power ? "OFF" : "ON"}</button>
    <h2>Volume: %{Math.round(volume * 100)}</h2>
    <input type="range" max="1" min="0" step="0.01" value={volume} onChange={handleVolumeChange} />
      <h2>{name}</h2>
  </div>
  );
}

{/* 
TYPE: Component
GOAL: Infrastacture for a recording component. Is not implemented yet.
*/}  

const Recording = () => {

  return (

<button type="button" className="btn btn-danger"> START RECORDING</button>
  );
}

{/* 
TYPE: Component
GOAL: Instructions on how to use Grooveo for the users.
*/}  


const Instructions = () => {

  return (
    <div>
      <h2>Click on the buttons to play sound in the next loop cycle!</h2>
      <h6>Use the keyboard if you just want to have some fun :) - Tip - You can use the Q,W,E,A,S,D,Z,X,C keys</h6>
    </div>
  );
}

{/* 
TYPE: Component
GOAL: The actual app, which includes all of the components inside of it. 
*/}  


function App() {
const [power, setPower] = React.useState(false);
const [sounds, setSounds] = React.useState(loopSounds);
const [soundName, setSoundName] = React.useState("");
const [volume, setVolume] = React.useState(1);
const [playingSounds, setPlayingSounds] = React.useState([]);
const [intervals,changeIntervals] = React.useState([]);

useEffect(() => {
  stopLoops();
}, []);


// removing audio file
function removeAudioFile(audio){
for (let index = 0; index < playingSounds.length; index++) {
      if (playingSounds[index] === audio){
        removeItem(index,playingSounds,setPlayingSounds);
      }
}
clearInterval(audio.intervalNumber);
}

{/* 
TYPE: Function
GOAL: Responsible of stoping all of the loops (Main stop button.)
*/}  

const stopLoops = () =>{
  setPower(power ? false : true);

  const audios = sounds.map(sound => document.getElementById(sound.key));
  audios.forEach(audio => {
    deactivateAudio(audio);
  });
// Go over all sounds and make false.
  sounds.map(sound => updateItem(sound.key,"status",false));
  setPlayingSounds([]);
  intervals.map(interval => clearInterval(interval));
  changeIntervals([]);
}

const handleVolumeChange = (event) => {
  setVolume(event.target.value);
}


const styleActiveKey = (audio) => {
  if(power){
  audio.parentElement.style.backgroundColor = "#000000";
  audio.parentElement.style.color = "#ffffff";
  }
}

const deactivateAudio = (audio) => {
  setTimeout(() => {
    audio.parentElement.style.backgroundColor = "#ffffff"
    audio.parentElement.style.color = "#000000"
  }, 300)
}


{/* 
TYPE: Function
GOAL: The main play function. Is called many times and is responsible for playing the padkeys.
*/}  

  const play = (key, id, keyPadStatus) => {

    if(power){

      const audio = document.getElementById(key);
      if(!keyPadStatus) {
          setSoundName(id)
          styleActiveKey(audio);
          updateItem(key,"status",keyPadStatus ? false : true);
          audio.currentTime = 0;
          // This is the older player
          setPlayingSounds(playingSounds => [...playingSounds,audio]);

            if(playingSounds.length === 0)
            {audio.play();}
            else{
              //to get into here - STATUS = FALSE AND MORE THAN ONE ITEM PLAYING
                let tempTime = playingSounds[0].currentTime;
              const intervalPointer = setInterval(()=>{audio.play()}, 8000 - tempTime *1000);
              audio.intervalNumber = intervalPointer;
              changeIntervals(intervals => [...intervals,intervalPointer]);
            }
           
      }else{
        updateItem(key,"status",keyPadStatus ? false : true);
        deactivateAudio(audio);   
        audio.pause();
        removeAudioFile(audio);
        
      }

    }
  };

{/* 
TYPE: Function
GOAL: Set volume function
*/}  

  const setKeyVolume = () => {
    const audios = sounds.map(sound => document.getElementById(sound.key));
   // console.log("Set Key Volume ran!");
    audios.forEach(audio => {
      if(audio) {
        audio.volume = volume;
      }
    }) 
  }

  // setting status on/off of keypad to be true/false
const updateItem = (key, value, newvalue) => {

  var index = loopSounds.findIndex(x => x.key === key);
  let g = loopSounds[index]
  g[value] = newvalue
  if (index === -1){
    // handle error
    console.log('no match')
  }
  else
  //  console.log(sounds);
    setSounds([
      ...sounds.slice(0,index),
      g,
      ...sounds.slice(index+1)
    ]
            );
}

const removeItem = (index,state,setState) => {

  if (index === -1){
    // handle error
    console.log('no match')
  }
  else
    setState([
      ...state.slice(0,index),
      ...state.slice(index+1)
    ]
            );
}

  return (

        <div id="loop_machine">
              {setKeyVolume()}
            <div className ="wrapper">
                <Pad power={power} play={play} sounds={sounds}/>
                
                <InstrumentControl 
                    stopLoops = {stopLoops}
                    volume ={volume}
                    power ={power}
                    handleVolumeChange ={handleVolumeChange}
                    name={soundName}/>

                    <Recording />

                    
            </div>
          <div className="wrapper-secondary">
          <Instructions />
          </div>

        </div>
        
  );
}

export default App;
