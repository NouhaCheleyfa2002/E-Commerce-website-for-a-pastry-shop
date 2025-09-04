import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { LoginContext } from '../context/LoginContext';
import { motion } from "framer-motion"
import axios from 'axios'
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const [state, setState] = useState('login');
    const {setShowLogin, backendUrl, setToken, setUser} = useContext(LoginContext);
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e)=>{
        e.preventDefault();

        try {
            if (state === 'login') {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
              
                if (data.success) {
                  localStorage.setItem('token', data.token);
                  setToken(data.token); // Set in context
                  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
              
                  try {
                    const decoded = jwtDecode(data.token);
              
                    if (!decoded.role) {
                      throw new Error("Role is missing in JWT");
                    }
              
                    const userData = { name: data.user.name, role: decoded.role };
              
                    setUser(userData); // Set in context
                    localStorage.setItem('user', JSON.stringify(userData)); // ✅ Save to localStorage
              
                    setShowLogin(false);
              
                    // Navigate based on role
                    decoded.role === 'admin' ? navigate('/admin') : navigate('/');
              
                  } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                  }
                } else {
                  toast.error(data.message);
                }              
              } else {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                  name,
                  email,
                  password,
                });
              
                if (data.success) {
                  const token = data.token;
                  localStorage.setItem("token", token);
                  setToken(token);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
                  try {
                    const decoded = jwtDecode(token);
                    const userData = {
                      name: data.user.name,
                      role: decoded.role,
                      _id: decoded._id,
                      email: decoded.email,
                    };
              
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    setShowLogin(false);
              
                    decoded.role === "admin" ? navigate("/admin") : navigate("/");
                  } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                  }
                } else {
                  toast.error(data.message);
                }
              }
              
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed");
        }
    };
   

    useEffect(()=>{
        document.body.style.overflow = 'hidden';

        return ()=>{
            document.body.style.overflow = 'unset';
        }
    },[])

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
 
    <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500 '
    initial={{opacity:0.2, y:50}}
    transition={{duration:0.3}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm'>Welcome back! please sign in to continue</p>

        {state !== 'login' && <div className='boder px-6 py-2 flex items-center gap-2 rounded-full mt-5 '>
            <img src={assets.profile_icon} width={20} alt="" />
            <input onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required/>
        </div>}

        <div className='boder px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.email_icon} width={20} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email' required/>
        </div>

        <div className='boder px-6 py-2 flex items-center gap-2 rounded-full mt-4 '>
            <img src={assets.lock_icon} width={20} alt="" />
            <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required/>
        </div>

        <p className='text-sm text-[#9b2226] my-4 cursor-pointer'>Forgot Password</p>

        <button className='bg-[#9b2226] w-full text-white py-2 rounded-full'>{state === 'login' ? 'login' : 'create account'}</button>

        {state === 'login' ?<p className='mt-5 text-center'>Don't have an account? <span className='text-[#9b2226] cursor-pointer' onClick={()=>setState('Sign Up')}>Sign Up</span></p>
         :
        <p className='mt-5 text-center'>Already have an account? <span className='text-[#9b2226] cursor-pointer' onClick={()=>setState('login')}>Login</span></p>}

        <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer w-[16px]'/>
    </motion.form>

    </div>
  )
}

export default Login
