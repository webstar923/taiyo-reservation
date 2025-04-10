import { useState } from 'react';
import FunctionalButton from '@/app/shared/components/UI/FunctionalButton';

import UploadIcon from '@/../../public/assets/icons/upload_arrow.svg';
import ShareIcon from '@/../../public/assets/icons/share.svg';
import DownloadIcon from '@/../../public/assets/icons/download.svg';
import FaceIcon from '@/../../public/assets/icons/face.svg';
import MoreIcon from '@/../../public/assets/icons/more.svg';

type Props = {
  activeButton?: string; 
  onButtonClick: (label: string) => void;
}

const FunctionalButtonGroup = ({ 
  activeButton = 'Upload or Drop', 
  onButtonClick 
}: Props) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const OPTIONS = ['Share', 'Download Folder', 'Face Detection'];

  const handleMoreIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (option: string) => {
    setIsDropdownOpen(false);
    onButtonClick(option);
  };

  return (
    <div className="buttons-group flex justify-between items-center">
      <div className="flex gap-3">
        <div>
          <FunctionalButton
            icon={<UploadIcon className="w-6 h-6 text-[#212529]" />}
            label="Upload or Drop"
            isActive={activeButton}
            onClick={() => onButtonClick('Upload or Drop')}
          />
        </div>

        <div>
          <FunctionalButton
            icon={<ShareIcon className="w-6 h-6 text-[#212529]" />}
            label="Share"
            isActive={activeButton}
            onClick={() => onButtonClick('Share')}
          />
        </div>

        <div className="hidden lg:flex">
          <FunctionalButton
            icon={<DownloadIcon className="w-6 h-6 text-[#212529]" />}
            label="Download Folder"
            isActive={activeButton}
            onClick={() => onButtonClick('Download Folder')}
          />
        </div>

        <div className="hidden lg:flex">
          <FunctionalButton
            icon={<FaceIcon className="w-6 h-6 text-[#212529]" />}
            isActive={activeButton}
            label="Face Detection"
            onClick={() => onButtonClick('Face Detection')}
          />
        </div>
      </div>
      <div className="relative lg:hidden">
        <button onClick={handleMoreIconClick}>
          <MoreIcon className="w-6 h-6" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-2 right-5 p-3 mt-1 w-[13.3rem] bg-white border border-gray-200 rounded-md shadow-lg z-40">
            {OPTIONS.map((option, index) => (
              <div
                key={index} 
                onClick={() => handleSelect(option)}
                className="flex gap-[10px] px-[10px] py-[9px] cursor-pointer hover:bg-gray-100 text-gray-700 rounded-lg"
              >
                <div className="scale-66">
                  {option === 'Share' && <ShareIcon className="w-4 h-4 text-[#212529]" />}
                  {option === 'Download Folder' && <DownloadIcon className="w-4 h-4 text-[#212529]" />}
                  {option === 'Face Detection' && <FaceIcon className="w-4 h-4 text-[#212529]" />}
                </div>
                <div>{option}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default FunctionalButtonGroup;