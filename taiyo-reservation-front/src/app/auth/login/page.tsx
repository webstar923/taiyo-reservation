'use client';
import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateEmail, validatePassword } from '@/utils/validation';
import AuthLayout from '@/app/layout/AuthLayout';
import CustomInput from '@shared/components/UI/CustomInput';
import CustomButton from '@shared/components/UI/CustomButton';
import Spinner from '@shared/components/UI/Spinner';
import Image from 'next/image';

const Login = () => { 
  
  const router = useRouter();
  const { mutate, status } = useLogin();
  const isLoading = status === 'pending';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!validateEmail(email)) newErrors.email = 'メール形式が正しくありません。';
    if (validatePassword(password)) newErrors.password = 'パスワードは8文字以上でなければなりません。';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors(null);

    mutate({ email, password }, {
      onSuccess: () => router.push('/dashboard'),
      onError: () => {        
        setErrors({ email: '無効な資格情報' });
      },
    });
  };

  return (
    <AuthLayout>
      <div className="mt-[100px] w-[80%] sm:w-[70%]">
        <div className="flex justify-center">
          <Image src="/assets/images/logo.png" alt="logo" width={280} height={280} className="mb-2 mt-[30px]" priority />
        </div>
        <div className="border-b border-gray-300 p-5 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">ログイン</h2>
          <p className="text-gray-400 text-center">詳細を入力してください</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          <div className="login-info-input border-b border-gray-300 p-5">
            <CustomInput value={email} onChangeHandler={setEmail} error={errors?.email} placeholder="メールアドレス" id="email" icon="error-feed" iconVisible={!!errors?.email} autoComplete="email" />
            <CustomInput value={password} onChangeHandler={setPassword} error={errors?.password} placeholder="パスワード-最低8文字" id="password" type={passwordShow ? 'text' : 'password'} icon={passwordShow ? 'hide' : 'show'} onIconClickHandler={togglePasswordVisibility} iconVisible autoComplete="current-password" />
            <div className="flex justify-end mt-4">
              <Link href="/auth/reset-password" className="text-sm hover:text-blue-800 text-black underline ml-5">パスワードをお忘れの方</Link>
            </div>
          </div>
          <div className="flex justify-between p-5">
            <Link href="/auth/register" className="flex justify-between mt-35 rounded-lg bg-white p-5 shadow-sm">
              <h4 className="text-black-600 hover:text-blue-800">サインアップ</h4>
            </Link>
            <CustomButton type="submit" isLoading={isLoading} label="ログイン" className="hover:opacity-80 p-2" />
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;
