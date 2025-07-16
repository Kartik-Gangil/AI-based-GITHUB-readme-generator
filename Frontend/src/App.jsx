import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './Components/Main'
import LandingPage from './Components/Landing_page'
// import Auth from './Components/Auth'
import { Analytics } from "@vercel/analytics/next"
const App = () => {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<LandingPage></LandingPage>} />
        <Route exact path='/main' element={<Main></Main>} />
        {/* <Route exact path='/auth' element={<Auth></Auth> } /> */}
        {/* <Route exact path='/ads.txt' element={<Ads></Ads>} /> */}
      </Routes>
      <Analytics />
    </>
  )
}

export default App
