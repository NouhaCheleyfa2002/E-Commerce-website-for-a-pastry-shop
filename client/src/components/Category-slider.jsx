import { useRef, useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { categories } from "../assets/assets";
import { useNavigate } from "react-router-dom";


export default function CategorySlider() {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        setCanScrollLeft(sliderRef.current.scrollLeft > 0);
        setCanScrollRight(
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth
        );
      }
    };
  
    if (sliderRef.current) {
      sliderRef.current.addEventListener("scroll", checkScroll);
    }
  
    checkScroll(); // Run once to update button visibility
  
    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);
  

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className=" py-12 text-center px-4">
      <h2 className="text-5xl font-semibold  text-[#bc6c25] mb-6">
        Savor Every Bite As You Indulge Into A World Of The Finest Flavors
      </h2>
      <div className="relative flex items-center mt-5">
        {canScrollLeft && (
          <button
            className="absolute left-2 bg-[#8B5E3C] text-white p-2 rounded-full shadow-lg z-10"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft />
          </button>
        )}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-hidden px-4 mt-5"
        >
          {categories.map((category, index) => (
            <div key={index} className="p-4 rounded-lg shadow-lg min-w-[250px]">
              <h3 className="text-xl font-semibold text-[#8B5E3C] mb-2">
                {category.name}
              </h3>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button className="mt-4 bg-[#8B5E3C] text-white px-4 py-1 rounded-lg" onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}>
                Show More Of This Category !
              </button>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            className="absolute right-2 bg-[#8B5E3C] text-white p-2 rounded-full shadow-lg z-10"
            onClick={() => scroll("right")}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
