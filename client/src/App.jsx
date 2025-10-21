import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'

function App() {
  const [givenLink, setGivenLink] = useState('');

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      if (!givenLink.includes('.')) {
        console.log("Invalid URL")
      } else {

        const response = await axios.post('http://localhost:3001/shorten', {
          url: givenLink,
        })
        console.log('Success:', response.data);
      
      }
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
  }

  useEffect(() => {
    const createStars = (id, count, size) => {
      const element = document.getElementById(id);
      let shadows = '';

      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 4000)
        const y = Math.floor(Math.random() * 4000)
        shadows += `${x}px ${y}px #FFF`
        if (i !== count -1) { shadows += `,` }
      }

      element.style.boxShadow = shadows;

      const secondLayer = document.createElement("div");
      secondLayer.style.position = "absolute";
      secondLayer.style.top = "4000px";
      secondLayer.style.width = `${size}px`;
      secondLayer.style.height = `${size}px`;
      secondLayer.style.boxShadow = shadows;
      secondLayer.style.background = "transparent"
      
      element.appendChild(secondLayer);
    }

    createStars("stars", 1400, 1);
    createStars("stars2", 400, 2);
    createStars("stars3", 175, 3);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#1B2735] to-[#090A0F] relative">
      <div id = "stars" className=" w-[1px] h-[1px] rounded-lg bg-transparent animate-animateStars"/>
      <div id = "stars2" className="absolute w-[2px] h-[2px] rounded-lg bg-transparent animate-animateStars2"/>
      <div id = "stars3" className="absolute w-[4px] h-[4px] rounded-lg bg-transparent animate-animateStars3" style = {{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}/>
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-[50px] font-geist font-bold text-[#D6DDE6]">
          precis
          <br/>
        </h1>
        <form onSubmit={handleSubmit} className="flex mt-4">
          <div className="flex w-[400px] h-[62px] rounded-lg items-center shadow-lg shadow-[#D6DDE6]/60">
            <input 
            type="text" 
            placeholder="ENTER LINK" 
            value={givenLink} 
            onChange={(e) => setGivenLink(e.target.value)} 
            // add enter button on right side of search bar
            // also some of the stars disappearing... ?? perhaps when 2nd layer loops
            className="w-[400px] h-[60px] p-4 text-[18px] placeholder:font-geist z-10 text-[#D6DDE6] font-geist bg-[#0f1117] rounded-l-lg placeholder:text-[#929292] ring-[1px] ring-[#3b3b3b] focus:outline-none focus:ring-[#D6DDE6] placeholder:text-[16px] focus:placeholder-transparent transition-all"
            />
            <button
              type="submit"
              className="right-2 z-10 bg-[#D6DDE6] text-[#0f1117] font-geist font-medium px-4 h-full rounded-r-lg shadow-lg"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App