export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const isValidPassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{7,}$/.test(password);
