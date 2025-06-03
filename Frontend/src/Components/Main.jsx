import { IoCloudDownloadOutline } from "react-icons/io5"
import axios from "axios"
import Loader from './Loader'
import { ToastContainer, toast } from 'react-toastify';

import { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
function Main() {
    const [url, setUrl] = useState('')
    const [loader, setLoader] = useState(false)
    // const [User, setUser] = useState('')
    const [repoName, setRepoName] = useState(localStorage.getItem('repo') || '');
    const leftAdRef = useRef(null);
    const rightAdRef = useRef(null);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.setAttribute('data-ad-client', 'ca-pub-4926740588559413');
        document.head.appendChild(script);

        script.onload = () => {
            try {
                if (leftAdRef.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
                if (rightAdRef.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (e) {
                console.error("AdSense push error:", e);
            }
        };
    }, []);



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
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-0 flex-grow">

                {/* Left Ad */}
                <div className="flex justify-center items-center p-4">
                    <ins className="adsbygoogle"
                        style={{ "display": "block" }}
                        data-ad-client="ca-pub-4926740588559413"
                        data-ad-slot="2035765656"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>

                {/* Main Content */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 py-10 px-4">
                    <h1 className="text-2xl font-bold ">Welcome</h1>
                    <h1 className="text-4xl md:text-5xl mt-4 font-bold text-center ">
                        AI ReadMe Generator
                    </h1>

                    <div className="flex flex-col sm:flex-row justify-center items-center my-10 gap-4 w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Paste your GitHub repo link"
                            className="px-3 py-2 border rounded-md w-full focus:outline-blue-500"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            onClick={handelGenerate}
                            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Generate
                        </button>
                    </div>

                    {loader && <Loader />}

                    {repoName && (
                        <button
                            onClick={handelDownload}
                            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
                        >
                            Download <IoCloudDownloadOutline className="text-2xl" />
                        </button>
                    )}

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

                {/* Right Ad */}
                <div className=" flex justify-center items-center p-4">
                    <ins className="adsbygoogle"
                        style={{ "display": "block" }}
                        data-ad-client="ca-pub-4926740588559413"
                        data-ad-slot="2035765656"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>

            </div>
        </div>


    )
}

export default Main
