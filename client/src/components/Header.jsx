import React, { useContext } from 'react'
import { delay, motion } from "framer-motion"
import { LoginContext } from '../context/LoginContext'
import { useNavigate } from 'react-router-dom'
import ImageCarousel from "./ImageCarousel"



const Header = () => {
  const {user, setShowLogin} = useContext(LoginContext);
  const navigate = useNavigate()

  const onClickHandler = ()=>{
    if(user){
      navigate('/')
    }else{1
      setShowLogin(true)
    }
  }

  return (
    <div >
      
      <ImageCarousel/>
      <motion.div className='flex flex-col justify-center  items-center my-20'
      initial={{opacity:0.2, y:100}}
      transition={{duration:1}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true}}
      >

        <motion.h1 className='text-5xl font-semibold  text-[#5f3c1c] mt-4' initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:2, delay:0.4}}>Trending Products</motion.h1>
        
         
      </motion.div>

    </div>
  )
}

export default Header
