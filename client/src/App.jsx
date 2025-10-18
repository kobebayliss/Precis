import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'


function App() {
  const [givenLink, setGivenLink] = useState('');

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const response = await axios.post('http://localhost:3001/shorten', {
        url: givenLink,
      })
      console.log('Success:', response.data);
      
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
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