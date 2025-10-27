import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CopyButton } from './components/CopyButton'
import { Spinner } from './components/Spinner'
import './App.css'

function App() {
  const [givenLink, setGivenLink] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();

      if (!givenLink.includes('.')) {
        console.log("Invalid URL")
      } else {

        const response = await axios.post('/api/shorten', {
          url: givenLink,
        })
        console.log('Success:', response.data);
        setShortCode(response.data.shortCode);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
  }

  useEffect(() => {
    const createStars = (id, count, size) => {
      const element = document.getElementById(id);
      let shadows = '';

      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 12000)
        const y = Math.floor(Math.random() * 12000)
        shadows += `${x}px ${y}px #FFF`
        if (i !== count -1) { shadows += `,` }
      }

      element.style.boxShadow = shadows;

      const secondLayer = document.createElement("div");
      secondLayer.style.position = "absolute";
      secondLayer.style.top = "12000px";
      secondLayer.style.width = `${size}px`;
      secondLayer.style.height = `${size}px`;
      secondLayer.style.boxShadow = shadows;
      secondLayer.style.background = "transparent"
      
      element.appendChild(secondLayer);
    }

    createStars("stars", 4200, 1);
    createStars("stars2", 1200, 2);
    createStars("stars3", 525, 3);
  }, []);

  useEffect(() => {
    const resultSection = document.getElementById("resultSection");
    if (resultSection) {
      if (shortCode === '') {
        resultSection.style.display = 'flex';
      } else {
        resultSection.style.display = 'flex';
      }
    }
  }, [shortCode]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#1B2735] to-[#090A0F] relative" style={{ minHeight: '100dvh' }}>
      <div id = "stars" className=" w-[1px] h-[1px] rounded-lg bg-transparent animate-animateStars"/>
      <div id = "stars2" className="absolute w-[2px] h-[2px] rounded-lg bg-transparent animate-animateStars2"/>
      <div id = "stars3" className="absolute w-[4px] h-[4px] rounded-lg bg-transparent animate-animateStars3" style = {{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}/>
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-[50px] font-geist font-bold text-[#D6DDE6]">
          precis
        </h1>
        <form onSubmit={handleSubmit} className="flex mt-4">
          <div className="flex w-[400px] h-[62px] rounded-lg items-center shadow-lg shadow-[#D6DDE6]/60">
            <input 
            type="text" 
            placeholder="ENTER LINK" 
            value={givenLink} 
            onChange={(e) => setGivenLink(e.target.value)} 
            className="w-[400px] h-[60px] p-4 text-[18px] placeholder:font-geist z-10 text-[#D6DDE6] font-geist bg-[#0f1117] rounded-l-lg placeholder:text-[#929292] ring-[1px] ring-[#3b3b3b] focus:outline-none focus:ring-[#D6DDE6] placeholder:text-[16px] focus:placeholder-transparent transition-all"
            />
            <button
              type="submit"
              className="right-2 z-10 bg-[#D6DDE6] text-[#0f1117] font-geist font-medium w-[112px] h-full rounded-r-lg shadow-lg flex items-center justify-center"
            >
              <div className={`${loading ? 'hidden' : 'block'}`}>shorten</div>
              <div className={`${loading ? 'block' : 'hidden'} `}>
                <Spinner variant="default"/>
              </div>
            </button>
          </div>
        </form>
        {shortCode &&
          <div id="resultSection" className="w-[360px] z-10 py-3 px-4 flex flex-col items-center bg-[#0f1117] text-[#D6DDE6] font-geist rounded-xl mt-6 border border-[#3b3b3b] shadow-md">
            <div id="header" className="w-full flex flex-col items-center text-center">
              <div className="text-lg font-semibold tracking-wide text-[#D6DDE6] mb-2">
                SHORTENED URL
              </div>
              <div className="break-all bg-[#1a1c24] px-3 py-2 rounded-md w-full text-[#D6DDE6] shadow-inner">
                {`${window.location.origin}/${shortCode}`}
              </div>
              <CopyButton content={`${window.location.origin}/${shortCode}`} size="sm" className="!bg-[#D6DDE6] !text-[#0f1117] !w-10 !h-10 !mx-auto !mt-3"/>
            </div>
          </div>
        }
        <a className="font-geist absolute text-[#D6DDE6] bottom-4" href="https://github.com/kobebayliss/Precis" target="_blank">
          <img src="/assets/images/github.png" alt="Github" className="w-12 h-auto"/>
        </a>
      </div>
    </div>
  )
}

export default App