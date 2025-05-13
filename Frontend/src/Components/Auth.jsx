import React, { useState } from 'react'

const Auth = () => {
    // const [status, setStatus] = useState('login')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [Cpassword, setCPassword] = useState('')

    // const handelStatus = () => {

    //     if (status == 'login') {
    //         setStatus('register')
    //     } else {
    //         setStatus('login')
    //     }
    // }
    return (
        <>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-300 p-8 rounded-2xl shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login via</h2>

                    {/* Email Field */}
                    {/* <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                        />
                    </div> */}

                    {/* Password Field */}
                    {/* <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {status == 'register' && <div className="mb-4">
                        <label className="block mb-1 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your Confirm password"
                            value={Cpassword}
                            onChange={e => setCPassword(e.target.value)}
                        />
                    </div>} */}

                    {/* Submit Button */}
                    {/* <button className="w-full bg-blue-600 text-white py-2 rounded-lg my-1.5 hover:bg-blue-700 transition">
                        {status == 'login' ? 'Log In' : 'Register'}
                    </button> */}
                    {/* {<button onClick={handelStatus} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        {status == 'login' ? 'Create an account' : 'Already have an account?'}
                    </button>} */}

                    

                    {/* Google Login */}

                    <a href="https://ai-based-github-readme-generator-production.up.railway.app/auth/google">
                        <button className="w-full mb-3 flex items-center justify-center gap-2 bg-white border py-2 rounded-lg hover:bg-gray-500 hover:cursor-pointer transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </button>
                    </a>

                    {/* Divider */}
                    <div className="my-3 text-center text-gray-800">OR</div>
                    {/* GitHub Login */}
                    <a href="https://ai-based-github-readme-generator-production.up.railway.app/auth/github">
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg border hover:bg-gray-500 hover:cursor-pointer transition">
                            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" />
                            <span>Continue with GitHub</span>
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Auth
