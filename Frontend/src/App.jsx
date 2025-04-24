import './App.css'
import { IoCloudDownloadOutline } from "react-icons/io5"
import axios from "axios"
import { useEffect, useState } from 'react'
function App() {
  const [url, setUrl] = useState('')



  useEffect(() => {
    localStorage.removeItem('repo')
  })

  const handelGenerate = async () => {
    const response = await axios.post('http://localhost:8000/', {
      url: url
    })
    if (response.status === 200) {
      console.log(response.data)
      localStorage.setItem('repo', response.data.repo)
    } else {
      console.error('Error generating readme:', response.data)
    }
  }

  const handelDownload = async () => {
    await axios.post('http://localhost:8000/getReadme',
      { repo: localStorage.getItem('repo') },
      { responseType: 'blob' }  // Important for downloading files
    ).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${localStorage.getItem('repo')}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    })
      .catch(error => {
        console.error('Download failed:', error);
      });
  }



  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center-safe align-center my-10 gap-2'>
        <input type="text" placeholder='Past your github repo link' className='px-3 py-2 border-1 outline-offset-0 outline-blue-500 focus:outline-2 focus:border-0 rounded-md
        w-96' value={url} onChange={e => setUrl(e.target.value)} />

        <button className='px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer' onClick={handelGenerate}>Generate</button>
      </div>
      <button onClick={handelDownload} className='px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer flex items-center gap-2'>Download <IoCloudDownloadOutline className='text-2xl ' /></button>
    </div>
  )
}

export default App
