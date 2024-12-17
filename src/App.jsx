import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';


import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({log:true});
function App() {
  
  const [ready,setReady] = useState(false);
  const [video,setVideo] = useState();
  const [gif,setGIF] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  },[])

  const converttoGIF = async () => {

    if(!video)
    {
      return alert("Please upload a video first");
    }

    const fileName = video.name;
    ffmpeg.FS('writeFile',fileName,await fetchFile(video));

    await ffmpeg.run('-i',fileName,'-t','2.5','-ss','3.0','-f','gif','out.gif');

    const data = ffmpeg.FS('readFile','out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer],{type:'image/gif'}))
    setGIF(url);

  }
  return ready ?(
    <div>
      {video && <video
                  controls
                  width={350}
                  src={URL.createObjectURL(video)}/>}
                  <br/>
      <input type='file' onChange={(e) => setVideo(e.target.files.item(0))}/>

      <h2>Result</h2>
      <button onClick={converttoGIF}>Convert to GIF</button><br/><br/>

      <div>{gif && <img src={gif} width={350}/>}</div>
    </div>
  ):(
    <p>Loading...</p>
  );
}

export default App;