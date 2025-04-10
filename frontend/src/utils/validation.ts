export const validateName = (fullName: string) => {
  if (!fullName) return "名前は必須です。";
};
export const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
export const validatePassword = (password: string) => {
  if (!password) return "パスワードが必要です。";
  if (password.length <8) return "パスワードは 8 文字以上でなければなりません。";
  
};

export const validConfirmPassword = (password1: string, password2: string) => {
  if (password1 !== password2) {
    return 'パスワードは一致する必要があります。';
  }
}

export const getPasswordStrength = (password: string) => {
  const hasText = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasText && hasNumber && hasSpecialChar) return "強い";
  if (hasText && (hasNumber || hasSpecialChar)) return "普通";
  return "弱い";
};

export const validateTermAgree = (agree: Boolean) => {
  if (!agree) return "利用規約に同意する必要があります。";
};
