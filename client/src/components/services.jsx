import { FaGem, FaTruck, FaMoneyBillWave } from "react-icons/fa";


export default function Services() {
  return (
    <section className=" py-12 px-4 text-center">
      <h2 className="text-5xl font-semibold  text-[#bc6c25] mb-6">Our Services</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10 mb-12 ">
        <div className="flex flex-col items-center max-w-xs mt-5">
          <FaGem className="text-[#8B5E3C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#8B5E3C]">High Quality Product</h3>
          <p className="text-sm text-gray-700">We make sure that all the ingredients used in the making of our product are high quality.</p>
        </div>
        <div className="flex flex-col items-center max-w-xs mt-5">
          <FaTruck className="text-[#8B5E3C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#8B5E3C]">Delivery All Over Tunisia</h3>
          <p className="text-sm text-gray-700">We provide quick delivery all over the country.</p>
        </div>
        <div className="flex flex-col items-center max-w-xs mt-5">
          <FaMoneyBillWave className="text-[#8B5E3C] text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-[#8B5E3C]">Very Affordable</h3>
          <p className="text-sm text-gray-700">You will be provided with the best quality at a very reasonable price.</p>
        </div>
      </div>
      
      <div className="bg-[#e1c2a2] py-6 px-8 rounded-lg flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
        <h3 className="text-base font-bold text-[#8B5E3C] mb- md:mb-0">Join Our Newsletter and be up to date with our newest products!</h3>
        <div className="flex w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter Email"
            className="p-2 rounded-l-lg border border-gray-300 flex-1 focus:outline-none"
          />
          <button className="bg-[#8B5E3C] text-white px-4 py-2 rounded-r-lg">Register Now</button>
        </div>
      </div>
    </section>
  );
}
