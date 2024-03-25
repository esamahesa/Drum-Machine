import React, { useState, useCallback, useEffect } from 'react';

const AudioObject = {
  1: {
    name: ["Heater 1", "Heater 2", "Heater 3", "Heater 4", "Clap", "Open HH", "Kick n' Hat", "Kick", "Closed HH"],
    src: [
      "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
      "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
    ]
  }
}

const addAudio = (audioName, audioSrc)=>{
  let object = {};

  for(let i = 0; i < audioName.length; i++){
    object[i] = {
      name: audioName[i],
      src: audioSrc[i]
    };
  }

  return object;
};

const Container = ( {updateAudio, audioName, updateAudioName, getAudio} )=>{
  return (
    <div id="drum-machine">

      <Display updateAudioName={updateAudioName}/>
      <DrumPad updateAudio={updateAudio} audioName={audioName} getAudio={getAudio}/>

    </div>
  )
}

const DrumPad = ( {updateAudio, audioName, getAudio} )=>{
  const Keys = 
  [
    'q', 'w', 'e',
    'a', 's', 'd',
    'z', 'x', 'c'
  ];

  const handleClick = useCallback((e)=>{
    const element = e.target;

    getAudio(
      element.classList.contains('drum-pad') ? 
    {keyPad: element.firstChild, id: element.id} : 
    {keyPad: element.firstChild.firstChild, id: element.firstChild.id});
  })

  return (
    <div className='drum-pad-wrapper'>
      {Keys.map((key, i)=>
        <div onClick={handleClick} key={i}>

          <div className='drum-pad' id={audioName[i].name.replace(/\s/g, "-")} key={i}>

            <Audio src={updateAudio[i].src} id={key.toUpperCase()} />
            {key.toUpperCase()}

          </div>

        </div>
      )}
    </div>
  )
}

const Audio = ( {id, src} )=>{
  return (
    <audio src={src} id={id} className='clip'></audio>
  )
}

const Display = ( {updateAudioName} )=>{
  const [text, setText] = useState('');

  useEffect(()=>{
    let textCopy = '';
    let count = 0;

    let WritingInterval = setInterval(() => {
      if(textCopy.length === updateAudioName.length){
        clearInterval(WritingInterval);
      } else{
        textCopy = textCopy + updateAudioName[count];
        count++;
        setText(textCopy);
      };
    }, 10);

    return () => clearInterval(WritingInterval);
  }, [updateAudioName]);

  return (
    <div className='display-wrapper'>
      <div id='display'>{text}</div>
    </div>
  )
}

function App() {
  // below this is place to add or even removing the audio
  const AudioStorages = {};
  AudioStorages["Sound 1"] = addAudio(AudioObject[1].name, AudioObject[1].src);

  // above this is place to add or even removing the audio
  const [audioName, setAudioName] = useState('No audio selected!');
  const getAudio = (elementObject)=>{
    const Audio = elementObject.keyPad;
    Audio.currentTime = 0;
    Audio.play();

    Audio.parentNode.parentNode.style.boxShadow = 'var(--box-shadow-key-click)';
    setTimeout(() => {
      Audio.parentNode.parentNode.style.boxShadow = 'var(--box-shadow-key-no-click)';
    }, 100);
    setAudioName(elementObject.id.replace(/-/g, " "));
  };
  
  useEffect(()=>{
    const handleKey = ()=>{
      const Keys = [
        'q', 'w', 'e',
        'a', 's', 'd',
        'z', 'x', 'c'
      ];

      return {
        handleKeyDown: (e)=>{
          if(Keys.includes(e.key.toLowerCase())){
            const Audio = document.querySelector(`#${e.key.toUpperCase()}`);

            Audio.currentTime = 0;
            Audio.play();

            Audio.parentNode.parentNode.style.boxShadow = 'var(--box-shadow-key-click)';
            setTimeout(() => {
              Audio.parentNode.parentNode.style.boxShadow = 'var(--box-shadow-key-no-click)';
            }, 100);
            setAudioName(Audio.parentNode.id.replace(/-/g, " "));
          }
        }
      };
    };

    window.addEventListener('keydown', handleKey().handleKeyDown);

    return ()=>{
      window.removeEventListener('keydown', handleKey().handleKeyDown);
    };
  }, []);

  return (
    <>
      <Container 
      updateAudio={AudioStorages["Sound 1"]} 
      audioName={AudioStorages["Sound 1"]}
      updateAudioName={audioName}
      getAudio={getAudio}
      />
    </>
  )
}

export default App;