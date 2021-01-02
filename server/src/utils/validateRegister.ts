import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  const { email, username, password } = options;

  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "Length must be greater than 2",
      },
    ];
  }

  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot include an @",
      },
    ];
  }

  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "Length must be greater than 2",
      },
    ];
  }

  return null;
};
