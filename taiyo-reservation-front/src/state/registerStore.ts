import {create} from 'zustand';

interface RegisterStore {
  formData: {
    name: string;
    phoneNum: string;
    email: string;
    password: string;
    confirmPassword: string;
    repName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    assGoal: string;
    notification: boolean;
    rememberMe: boolean;
    accountType:string;
    currentStep:number;
  };
  
  setField: (key: keyof RegisterStore['formData'], value: string | boolean | number) => void;
  resetForm: () => void;
  
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  formData: {
    name: '',
    phoneNum: '',
    email: '',
    password: '',
    confirmPassword: '',
    repName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    assGoal: '',
    accountType:'',
    notification: false,
    rememberMe: false,
    currentStep:1,
  },
  setField: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      formData: {
        name: '',
        phoneNum: '',
        email: '',
        password: '',
        confirmPassword: '',
        repName: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        assGoal: '',
        accountType:'',
        notification: false,
        rememberMe: false,
        currentStep:1,
      },
    })),
}));
