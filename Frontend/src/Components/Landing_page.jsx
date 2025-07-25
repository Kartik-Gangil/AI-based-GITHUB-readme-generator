import Testimonials from './Testimonials'
import CursorGradient from './CursorGradient'
import { Link } from 'react-router-dom'
import Rocket_Animation from './Rocket_Animation'

const LandingPage = () => {

    const comments = [
        {
            "name": "Ananya Sharma",
            "comment": "Absolutely loved the simplicity of this tool! It saved me a ton of time on my project submissions."
        },
        {
            "name": "Rahul Verma",
            "comment": "README Generator helped me clean up 6 repos in under 10 minutes. Super efficient!"
        },
        {
            "name": "Priya Nair",
            "comment": "I usually hate writing README files. This tool changed that completely!"
        },
        {
            "name": "Amit Joshi",
            "comment": "Great work Kartik! Just used it for my portfolio repo – looks so much more professional now."
        },
        {
            "name": "Sneha Kapoor",
            "comment": "This is the kind of tool I wish I had in my first year of college. Brilliant idea."
        },
        {
            "name": "Devansh Mehra",
            "comment": "Simple, fast, and clean. Just the way I like my dev tools. 10/10!"
        },
        {
            "name": "Ritika Sengupta",
            "comment": "Love the glowing UI and the ease of use. Will be sharing this with my dev team."
        },
        {
            "name": "Manish Raj",
            "comment": "Just added a README to my side project in 20 seconds. Amazing!"
        },
        {
            "name": "Sahil Khan",
            "comment": "Looks futuristic and works like magic. Excited to see more features added!"
        },
        {
            "name": "Tanvi Vora",
            "comment": "Very intuitive and developer-friendly. The Gen AI part is impressive!"
        }
    ];



    return (
        <div className="relative overflow-hidden">
            <CursorGradient />
            <div className="min-h-screen px-6 py-12 text-white font-sans" style={{ backgroundColor: '#0F0F1B' }}>
                {/* Header */}
                <header className="max-w-5xl mx-auto text-center mb-12">
                    <h1 className="text-4xl flex items-center justify-center font-bold tracking-tight sm:text-5xl" >
                        <Rocket_Animation /> ReadmeUp...
                    </h1>
                    <p className="mt-4 text-lg text-[#38BDF8] drop-shadow-[0_0_10px_#38BDF8]">
                        Instantly generate professional README.md files for your GitHub repos.
                    </p>
                    <div className="mt-6 ">
                        <Link
                            to="/main"
                            rel="noreferrer"
                            className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-semibold shadow-[0_0_10px_#38BDF8] hover:shadow-[0_0_16px_#38BDF8] transition duration-300 hover:scale-105 "
                        >
                            Try It Now →
                        </Link>
                    </div>
                    <div className="mt-6 text-sm text-[#94A3B8] drop-shadow-[0_0_10px_#38BDF8]">
                        ✅ Used by 173+ developers worldwide
                    </div>
                </header>
                <div className="flex justify-center">

                    <Link to="https://www.producthunt.com/products/readmeup?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-readmeup" target="_blank">
                        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=993726&theme=dark&t=1752725675776" alt="ReadmeUp - Instantly&#0032;generate&#0032;professional&#0032;README&#0032;files&#0032;for&#0032;your&#0032;GitHub | Product Hunt" className='hover:bg-[#0EA5E9] text-white  rounded-xl font-semibold shadow-[0_0_10px_#38BDF8] hover:shadow-[0_0_16px_#38BDF8] transition duration-300 hover:scale-105 ' />
                    </Link>
                </div>




                {/* Testimonials */}
                <section className="max-w-6xl mx-auto mb-20 mt-10">
                    <h2 className="text-2xl font-bold mb-6 text-center">What Developers Say</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {comments.map((comment, index) => (
                            <Testimonials
                                desc={comment.comment}
                                status={comment.name}
                                key={index}
                            />))}

                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-gray-400 text-sm mt-16">
                    Built with ❤️ by Kartik | <a href="https://github.com/Kartik-Gangil/AI-based-GITHUB-readme-generator.git" className="underline">GitHub</a>
                </footer>
            </div>
        </div>

    )
}

export default LandingPage
