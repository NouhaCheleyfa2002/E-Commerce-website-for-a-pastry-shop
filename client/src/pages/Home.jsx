import React from 'react'
import Header from '../components/Header'
import CategorySlider from '../components/Category-slider'
import Services from '../components/services'
import Cards from '../components/Cards'



const Home = () => {
  return (
    <div>
      <Header/>
      <div className="container mt-5 ">
            <Cards/>
        </div>
      <div className="container mt-5">

         <CategorySlider/>
         </div>
      <div className="container mt-2">
         <Services/>
      </div>
     
      
      
    </div>
  )
}

export default Home
