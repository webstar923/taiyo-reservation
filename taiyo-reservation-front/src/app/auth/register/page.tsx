'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';
import { useRegisterStore } from '@/state/registerStore';
import { validateEmail, validatePassword } from '@/utils/validation';
import Link from 'next/link';
import Image from 'next/image';

import AuthLayout from '@/app/layout/AuthLayout';
import CustomInput from '@shared/components/UI/CustomInput';
import Spinner from '@shared/components/UI/Spinner';
import CustomButton from '@shared/components/UI/CustomButton';

const Register: React.FC = () => {
  const router = useRouter();
  const { mutate } = useRegister();
  const { formData, setField } = useRegisterStore();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: Partial<typeof formData> = {};
    if (!formData.name) validationErrors.name = '名前は必須です';
    if (!formData.phoneNum) validationErrors.phoneNum = '電話番号は必須です';
    if (!validateEmail(formData.email)) validationErrors.email = '無効なメールアドレスです';
    if (validatePassword(formData.password)) validationErrors.password = 'パスワードは8文字以上でなければなりません';
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'パスワードと確認パスワードが一致しません';
    }
    if (!formData.address) validationErrors.address = '住所は必須です';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      phoneNum: formData.phoneNum,
      email: formData.email,
      password: formData.password,
      address: formData.address,
    };

    setIsLoading(true);
    mutate(payload, {
      onSuccess: () => {
        setIsLoading(false);
        router.push('/auth/login');
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <AuthLayout>
      <div className="mt-[100px] w-[70%]">
        <div className="flex justify-center">
          <Image src="/assets/images/logo.png" alt="logo" width={280} height={280} className="mb-2 mt-[30px]" priority />
        </div>

        <div className="border-b border-gray-300 p-5 flex flex-col justify-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">会員登録</h2>
          <p className="text-gray-400 text-center">詳細を入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <CustomInput
            value={formData.name}
            onChangeHandler={(value) => setField('name', value)}
            error={errors.name}
            placeholder="氏名（例：一休太郎）"
            id="name"
          />
          <div className="md:flex md:gap-4">
            <CustomInput
              value={formData.phoneNum}
              onChangeHandler={(value) => setField('phoneNum', value)}
              error={errors.phoneNum}
              placeholder="携帯番号（ハイフン不要）"
              id="phoneNum"
            />
            <CustomInput
              value={formData.email}
              onChangeHandler={(value) => setField('email', value)}
              error={errors.email}
              placeholder="メールアドレス（例：aaa@gmail.com）"
              id="email"
            />
          </div>  

          <div className="md:flex md:gap-4">
            <CustomInput
              value={formData.password}
              onChangeHandler={(value) => setField('password', value)}
              error={errors.password}
              placeholder="パスワード（8～20文字）"
              id="password"
              type={passwordShow ? 'text' : 'password'}
              icon={passwordShow ? 'hide' : 'show'}
              onIconClickHandler={togglePasswordVisibility}
              iconVisible
            />
            <CustomInput
              value={formData.confirmPassword}
              onChangeHandler={(value) => setField('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="パスワードを確認してください"
              id="confirmPassword"
              type={passwordShow ? 'text' : 'password'}
              icon={passwordShow ? 'hide' : 'show'}
              onIconClickHandler={togglePasswordVisibility}
              iconVisible
            />
          </div>         

          <CustomInput
            value={formData.address}
            onChangeHandler={(value) => setField('address', value)}
            error={errors.address}
            placeholder="住所を入力してください。"
            id="address"
          />

          <div className="flex justify-between border-t border-gray-300 mt-2 py-3">
            <Link href="/auth/login" className="mt-3 rounded-lg bg-white p-5 shadow-sm">
              <h4 className="text-black-600 hover:text-blue-800">ログイン</h4>
            </Link>
            <CustomButton type="submit" label="Next" className="hover:opacity-80" />
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

export default Register;
