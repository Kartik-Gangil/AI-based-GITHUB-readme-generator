import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Main from './Components/Main'
import Auth from './Components/Auth'
const App = () => {
  return (
    <Routes>
      <Route exact path='/' element={<Main></Main> } />
      <Route exact path='/auth' element={<Auth></Auth> } />
    </Routes>
  )
}

export default App
