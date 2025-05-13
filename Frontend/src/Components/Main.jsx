import { IoCloudDownloadOutline } from "react-icons/io5"
import axios from "axios"
import Loader from './Loader'
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Main() {
    const [url, setUrl] = useState('')
    const [loader, setLoader] = useState(false)
    const [User, setUser] = useState('')
    const [repoName, setRepoName] = useState(localStorage.getItem('repo') || '');

    const navigate = useNavigate();
   
    const handelISAuthenticated = () => {
        try {
            axios.get('https://ai-based-github-readme-generator-production.up.railway.app/auth/me', {
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.success == true) {
                        console.log("authenticated")
                        setUser(res.data.user.name)
                    }
                })
                .catch(async (err) => {

                    if (err.response && err.response.status === 401) {
                        // Redirect to login if unauthorized
                        await navigate('/auth');
                    } else {
                        console.error('Error checking authentication:', err);
                    }

                })
        }
        catch (error) {
            console.error('Error checking authentication:', error);
        }
    }

    useEffect(() => {
        handelISAuthenticated()

    }, [handelISAuthenticated])

    const handelGenerate = async () => {
        setLoader(true)
        const response = await axios.post('https://ai-based-github-readme-generator-production.up.railway.app/', {
            url: url
        })
        if (response.status === 200) {
            toast.success(response.data.message)
            localStorage.setItem('repo', response.data.repo)
            setRepoName(response.data.repo) 
            setLoader(false)
        } else {
            console.error('Error generating readme:', response.data)
            setLoader(false)
        }
    }

    const handelDownload = async () => {
        await axios.post('https://ai-based-github-readme-generator-production.up.railway.app/getReadme',
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
            localStorage.removeItem('repo')
            setRepoName('')
        })
            .catch(error => {
                console.error('Download failed:', error);
            });
    }





    return (
        <>
            <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 to-50% overflow-hidden'>
                <h1 className='text-2xl mt-2 font-bold'>Welcome , {User}</h1>
                <h1 className='text-5xl mt-5 font-bold'>AI ReadMe Generator</h1>
                <div className='flex justify-center-safe align-center my-10 gap-2'>
                    <input type="text" placeholder='Past your github repo link' className='px-3 py-2 border-1 outline-offset-0 outline-blue-500 focus:outline-2 focus:border-0 rounded-md
        w-96' value={url} onChange={e => setUrl(e.target.value)} />

                    <button className='px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer' onClick={handelGenerate}>Generate</button>
                </div>


                {loader &&
                    <Loader />}
                {

                    repoName && (

                        <button onClick={handelDownload} className='mt-6 px-2 py-2 border-2 rounded-lg bg-blue-700 text-white hover:bg-green-700 hover:cursor-pointer flex items-center gap-2'>Download <IoCloudDownloadOutline className='text-2xl ' /></button>)
                }

                <ToastContainer 
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    />
          
            </div>
        </>

    )
}

export default Main
