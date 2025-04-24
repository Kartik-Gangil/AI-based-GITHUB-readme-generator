import './App.css'
import { IoCloudDownloadOutline } from "react-icons/io5"
function App() {
 
  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center-safe align-center my-10 gap-2'>
        <input type="text" placeholder='Past your github repo link' className='px-3 py-2 border-1 outline-offset-0 outline-blue-500 focus:outline-2 focus:border-0 rounded-md
        w-96' />
        <button className='px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer'>Generate</button>
     </div>
      <button className='px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer flex items-center gap-2'>Download <IoCloudDownloadOutline className='text-2xl ' /></button>
    </div>
  )
}

export default App
