import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center item-center h-[80vh]'>
        <div className='animate-spin rounded-full h-14 w-14 border-4 border-grey-300 border-t-primary'></div>
      
    </div>
  )
}

export default Loader
