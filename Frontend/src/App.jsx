
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Main from './Components/Main'
import LandingPage from './Components/Landing_page'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<LandingPage/>} />
          <Route exact path='/main' element={<Main/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
