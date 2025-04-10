import React from 'react';

type PasswordStrengthIndicatorProps = {
  password: string;
  strength: string; // "弱い", "普通", "強い", or others
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  strength,
}) => {
  if (!password) return null;

  const getStrengthColor = (level: string) => {
    switch (level) {
      case '弱い':
        return 'bg-[#ff6f61] text-[#ff6f61]';
      case '普通':
        return 'bg-[#ffce09] text-[#ffce09]';
      case '強い':
        return 'bg-[#00cc00] text-[#00cc00]';
      default:
        return 'bg-[#d9d9d9] text-[#d9d9d9]';
    }
  };

  return (
    <div className="password-strength mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">パスワードの強度</p>
      <div className="flex items-center gap-2">
        {/* Strength Bars */}
        <div
          className={`h-1 rounded-md w-16 ${
            strength === '弱い' || strength === '普通' || strength === '強い'
              ? getStrengthColor('弱い').split(' ')[0]
              : 'bg-[#d9d9d9]'
          }`}
          aria-label="たて弱い Strength"
        ></div>
        <div
          className={`h-1 rounded-md w-16 ${
            strength === '普通' || strength === '強い'
              ? getStrengthColor('普通').split(' ')[0]
              : 'bg-[#d9d9d9]'
          }`}
          aria-label="普通 Strength"
        ></div>
        <div
          className={`h-1 rounded-md w-16 ${
            strength === '強い' ? getStrengthColor('強い').split(' ')[0] : 'bg-[#d9d9d9]'
          }`}
          aria-label="強い Strength"
        ></div>

        {/* Strength Label */}
        <div className={`text-sm font-medium ${getStrengthColor(strength).split(' ')[1]}`}>
          {strength}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
