import { useState } from "react"

function App() {
  const[m3u8file,setM3u8file] = useState("");

  function convert(){
    alert(m3u8file);
  }
  return (
    <div className="w-screen h-screen bg-[#131314]">
      <div className="h-full w-full flex flex-col items-center">
        <div><h1 className="text-transparent bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text py-4 text-4xl lg:text-8xl font-semibold font-Raleway">HlM4</h1></div>
        <div className="pt-16"><p className="text-3xl mx-16 text-slate-400 text-center lg:text-5xl font-Raleway font-medium brightness-200">Hls(M3U8) to MP4 Converter.</p></div>
        <div className="mt-20 xl:mt-36 flex flex-row rounded-md justify-center bg-white xl:w-96"><div className="w-[80%]"><input placeholder="your m3u8 file link here..." onChange={(e)=>{setM3u8file(e.target.value)}} type="text" value={m3u8file} className="bg-white p-1 outline-none w-full"/></div><div className="bg-blue-500 w-[20%] p-1 cursor-pointer" onClick={convert}>Convert</div></div>
        <div>
          <video className="border-2 border-slate-400 mt-16 h-[250px] w-[450px]" controls>
            <source src={m3u8file} type="video/mp4"/>
          </video>
        </div>
        <div className="mt-8"><button className="bg-green-400 p-1">Download</button></div>
      </div>
    </div>
  )
}

export default App