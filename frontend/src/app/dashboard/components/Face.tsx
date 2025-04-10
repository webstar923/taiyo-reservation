import React from 'react'

type Props = {
  image: string;
  count: number;
  className?: string;
}

const Face = ({
  image,
  count,
  className
}: Props) => {
  return (
    <div className={`faces-content flex ${className || ''}`}>
      <div className="face-item">
        <div 
          className={`flex justify-center items-end w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-full bg-cover bg-center bg-no-repeat`}
          style={{ backgroundImage: `url('/assets/images/faces/${image}.jpg')` }}
        >
          <div className="bg-[#00a0ff] w-6 h-6 sm:w-8 sm:h-8 text-center pt-[2px] sm:pt-1 text-white text-[14px] sm:text-[16px] rounded-full mb-[-12px] sm:mb-[-16px]">
            {count}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Face;