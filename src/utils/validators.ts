export const validateEmail = (value: string) => {
  const re = /\S+@\S+\.\S+/;
  if (!value) return "Email обязателен";
  if (!re.test(value)) return "Неверный формает email";
  return "";
};

export const validatePassword = (value: string) => {
  if (!value) return "Пароль обязателен";
  if (value.length < 6) return "Пароль должен содердать не менее 6 символов";
  return "";
};

export const validateDisplayName = (value: string) => {
  if (!value) return "Имя пользователя обязательно";
  if (value.length < 3) return "Ваше имя должно содержать не менее 3 символов";
  return "";
};
