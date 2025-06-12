

const Testimonials = (props) => {
  return (
      <div className="bg-[#38BDF8]/10 backdrop-blur-md border border-[#38BDF8] text-white p-5 rounded-xl shadow-[0_0_12px_#38BDF8] transition duration-300 hover:scale-[1.05]">
          <p className="italic">{props.desc}</p>
          <p className="mt-2 font-semibold">— {props.status}</p>
      </div>
  )
}

export default Testimonials
