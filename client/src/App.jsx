import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [givenLink, setGivenLink] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log(givenLink);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-400 flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold text-white">
        Precis - URL Shortener
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-4 mt-8">
        <input type="text" placeholder="Enter link" value={givenLink} onChange={(e) => setGivenLink(e.target.value)} className="w-[500px] h-[50px] mt-8 placeholder:text-center text-center"/>
      </form>
    </div>
  )
}

export default App