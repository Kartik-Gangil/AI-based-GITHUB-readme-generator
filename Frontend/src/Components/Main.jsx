import { IoCloudDownloadOutline } from "react-icons/io5"
import axios from "axios"
import Loader from './Loader'
import { ToastContainer, toast } from 'react-toastify';

import { useEffect, useRef, useState } from 'react'
import MD_viewer from "./MD_viewer";
import CursorGradient from "./CursorGradient";
// import { useNavigate } from 'react-router-dom'
function Main() {
    const [url, setUrl] = useState('')
    const [loader, setLoader] = useState(false)
    const [Source, setSource] = useState()
    const [repoName, setRepoName] = useState(localStorage.getItem('repo') || '');
    const leftAdRef = useRef(null);
    const rightAdRef = useRef(null);
    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    //     script.async = true;
    //     script.setAttribute('data-ad-client', 'ca-pub-4926740588559413');
    //     document.head.appendChild(script);

    //     script.onload = () => {
    //         try {
    //             if (leftAdRef.current) {
    //                 (window.adsbygoogle = window.adsbygoogle || []).push({});
    //             }
    //             if (rightAdRef.current) {
    //                 (window.adsbygoogle = window.adsbygoogle || []).push({});
    //             }
    //         } catch (e) {
    //             console.error("AdSense push error:", e);
    //         }
    //     };
    // }, []);



    const handelGenerate = async () => {
        setLoader(true)
        const response = await axios.post('https://ai-based-github-readme-generator-production.up.railway.app/', {
            url: url
        })
        if (response.status === 200) {
            toast.success(response.data.message)
            localStorage.setItem('repo', response.data.repo)
            setRepoName(response.data.repo)
            setSource(response.data.content)
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
        <div className="relative overflow-hidden">
            <CursorGradient />
            <div className="min-h-screen px-6 py-12 flex flex-col bg-[#0F0F1B]">


                {/* Main Content */}
                <div className="flex flex-col justify-center items-center text-white">

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        ReadmeUp...
                    </h1>
                    <p className="mt-4 text-lg text-center text-[#38BDF8] drop-shadow-[0_0_10px_#38BDF8]">
                        Instantly generate professional README.md files for your GitHub repos.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center my-10 gap-4 w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Paste your GitHub repo link"
                            className="px-3 py-2 border rounded-md w-full focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            onClick={handelGenerate}
                            className="px-4 hover:bg-[#0EA5E9] py-2 bg-blue-700 text-white rounded-lg  hover:shadow-[0_0_16px_#38BDF8] transition duration-300 hover:scale-105"
                        >
                            Generate
                        </button>
                        {repoName && (

                            <button
                                onClick={handelDownload}
                                className=" px-4 py-2 hover:bg-[#0EA5E9] bg-blue-700 text-white rounded-lg  flex items-center gap-2 hover:shadow-[0_0_16px_#38BDF8] transition duration-300 hover:scale-105"
                            >
                                Download <IoCloudDownloadOutline className="text-2xl" />
                            </button>
                        )}
                    </div>

                    {loader && <Loader />}
                    {repoName &&
                        (
                            <section className="w-full max-w-4xl px-4 sm:px-6 md:px-8 py-6 border border-[#0EA5E9] shadow-[0_0_12px_#38BDF8] rounded-lg mt-6 mx-auto">

                                <MD_viewer Source={Source} />

                            </section>
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
            </div>
        </div>

    )
}

export default Main
