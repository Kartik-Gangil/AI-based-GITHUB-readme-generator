import { IoCloudDownloadOutline } from "react-icons/io5"
import axios from "axios"
import Loader from './Loader'
import { ToastContainer, toast } from 'react-toastify';

import { useEffect, useRef, useState } from 'react'
import MD_viewer from "./MD_viewer";
import CursorGradient from "./CursorGradient";
import Rocket_Animation from "./Rocket_Animation";
// import { useNavigate } from 'react-router-dom'


function Main() {
    const [url, setUrl] = useState('')
    const [loader, setLoader] = useState(false)
    const [Source, setSource] = useState('')
    const [Branches, setBranches] = useState([])
    const [Branch, setBranch] = useState()
    const [repoName, setRepoName] = useState(localStorage.getItem('repo') || '');
    const leftAdRef = useRef(null);
    const rightAdRef = useRef(null);
    const [showGithubLogin, setShowGithubLogin] = useState(true);

    // console.log(Branch)
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

    // https://github.com/Kartik-Gangil/AI-based-GITHUB-readme-generator.git

    useEffect(() => {
        axios.get("https://leelafacility/api1/auth-check", {
            withCredentials: true
        })
            .then(res => {
                setShowGithubLogin(false)
            })
            .catch(err => {
                setShowGithubLogin(true)
            })
    }, [])


    useEffect(() => {
        if (url !== '') {
            fetchBranches()
        }
    }, [url])


    async function parseURL(url) {
        try {
            const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/;
            const match = url.match(regex);
            if (match) {
                const owner = match[1];
                const repo = match[2].replace(/\.git$/, '');//remove .git if present
                return { owner, repo };
            }
        }
        catch (err) {
            console.error("Error parsing URL:", err.message);
        }
    }
    const copyReadme = async () => {

        await navigator.clipboard.writeText(Source);

        toast.success("README copied!");
    };

    async function fetchBranches() {
        const { owner, repo } = await parseURL(url) || {};
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/branches`)
        response.data.map((branch) => {
            setBranches((prevBranches) => [...prevBranches, branch.name])
        })
        // setBranches(response.data)
    }
    const handelGenerate = async () => {

        setLoader(true)

        if (url === '') {
            setLoader(false)
            toast.error("Please enter a URL")
            return
        }

        if (url && !url.includes("https://github.com")) {
            setLoader(false)
            toast.error("Please enter a valid GitHub repository URL")
            return
        }

        try {

            const toastId = toast.loading("Analyzing repository...");

            const response = await fetch("https://leelafacility/api1/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url, branch: Branch })
            });

            if (!response.body) {
                throw new Error("Streaming not supported");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let result = "";
            let firstChunk = true;

            while (true) {

                const { done, value } = await reader.read();

                if (done) break;

                if (firstChunk) {

                    toast.update(toastId, {
                        render: "Generating README...",
                        type: "info",
                        isLoading: true
                    });

                    setLoader(false);
                    firstChunk = false;
                }

                const chunk = decoder.decode(value);

                result += chunk;

                setSource(result);
            }

            toast.update(toastId, {
                render: "README generated successfully 🚀",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

        } catch (error) {

            setLoader(false)

            toast.error("Error generating README")

            console.error(error)
        }
    };

    // const handelDownload = async () => {
    //     await axios.post('http://localhost:8000/getReadme',
    //         { repo: localStorage.getItem('repo') },
    //         { responseType: 'blob' }  // Important for downloading files
    //     ).then(response => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `${localStorage.getItem('repo')}.md`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         window.URL.revokeObjectURL(url);
    //         localStorage.removeItem('repo')
    //         setRepoName('')
    //     })
    //         .catch(error => {
    //             console.error('Download failed:', error);
    //         });
    // }





    return (

        <div className="relative overflow-hidden">

            <CursorGradient />

            <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0F0F1B]">

                {/* Main Container */}
                <div className="w-full max-w-5xl text-white text-center">

                    {/* GitHub Login Modal */}
                    {showGithubLogin && (

                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">

                            <div className="bg-[#1E1E3A] text-white p-6 rounded-xl shadow-xl border border-[#38BDF8] w-full max-w-md">

                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                    </svg>

                                    Login with GitHub
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    To generate README, please authorize with GitHub.
                                </p>

                                <div className="flex justify-end">

                                    <a
                                        href="https://leelafacility/api1/auth/github"
                                        className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] transition"
                                    >
                                        Login
                                    </a>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* Heading */}

                    <h1 className="text-4xl flex items-center justify-center font-bold tracking-tight sm:text-5xl">

                        <Rocket_Animation /> ReadmeUp...

                    </h1>

                    <p className="mt-4 text-lg text-[#38BDF8] drop-shadow-[0_0_10px_#38BDF8]">

                        Instantly generate professional README.md files for your GitHub repos.

                    </p>

                    {/* Input Section */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10 max-w-3xl mx-auto">

                        <input
                            type="text"
                            placeholder="Paste your GitHub repo link"
                            className="px-3 py-2 border rounded-md w-full focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        <select
                            onClick={(e) => setBranch(e.target.value)}
                            className="px-3 py-2 border rounded-md w-full focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                        >

                            {Branches.length > 0 ? (

                                Branches.map((branch, index) => (

                                    <option
                                        key={index}
                                        className="text-black"
                                        value={branch}
                                    >
                                        {branch.toUpperCase()}
                                    </option>

                                ))

                            ) : (

                                <option>No Branches</option>

                            )}

                        </select>

                        <button
                            onClick={handelGenerate}
                            className="px-4 py-2 bg-blue-700 hover:bg-[#0EA5E9] text-white rounded-lg hover:shadow-[0_0_16px_#38BDF8] transition hover:scale-105"
                        >
                            Generate
                        </button>

                    </div>

                    {/* Download Button */}

                    {Source && (

                        <div className="flex justify-center mb-6">

                            <button
                                onClick={copyReadme}
                                className="px-4 py-2 bg-blue-700 hover:bg-[#0EA5E9] text-white rounded-lg flex items-center gap-2 hover:shadow-[0_0_16px_#38BDF8] transition hover:scale-105"
                            >
                                Copy
                                <IoCloudDownloadOutline className="text-2xl" />
                            </button>

                        </div>

                    )}

                    {/* Loader */}

                    {loader && <Loader />}

                    {/* Markdown Viewer */}

                    {Source != '' && (

                        <section className="w-full max-w-4xl px-6 py-6 border border-[#0EA5E9] shadow-[0_0_12px_#38BDF8] rounded-lg mt-6 mx-auto text-left">

                            <MD_viewer Source={Source} />

                        </section>

                    )}

                    <ToastContainer theme="dark" />

                </div>

            </div>

        </div>
    )
}

export default Main
