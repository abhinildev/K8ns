import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactTyped } from "react-typed"

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className='text-white'>
      <div className='max-w-200 -mt-24 w-full h-screen mx-auto text-center flex flex-col justify-center'>

        <p className='text-[#00df9a] font-bold p-2'>
          Kubernetes-Native Store Provisioning
        </p>

        <h1 className='md:text-7xl sm:text-6xl text-4xl md:py-6'>
          Provision Stores Instantly
        </h1>

        <div className='flex justify-center items-center'>
          <p className='md:text-3xl sm:text-3xl text-xl font-bold py-4'>
            Create production-ready
          </p>

          <ReactTyped
            className='md:text-3xl sm:text-4xl md:pl-2 text-xl font-bold pl-2'
            strings={['WooCommerce stores', 'Medusa stores', 'isolated environments']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>

        <p className='md:text-2xl text-xl font-bold text-gray-500'>
          One click to provision, monitor, and delete fully isolated ecommerce stores on Kubernetes
        </p>

       <button
  onClick={() => navigate('dashboard')}
  className="
    bg-[#00df9a]
    w-50
    rounded-md
    my-6
    mx-auto
    py-3
    text-black
    font-semibold
    transition-all
    duration-300
    ease-out
    hover:scale-105
    hover:shadow-[0_0_25px_#00df9a]
    active:scale-95
  "
>
  Launch Dashboard
</button>


      </div>
    </div>
  )
}

export default Hero
