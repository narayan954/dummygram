const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$%#^&*])(?=.*[0-9]).{8,}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = {
  name: (value) => {
    if (!value) return { name: true, nameError: "Name field cannot be empty" };
    else {
      return value.length < 6
        ? {
            name: true,
            nameError: "Name must be atleast 6 characters long.",
          }
        : { name: false, nameError: false };
    }
  },
  email: (value) => {
    return emailRegex.test(value)
      ? { email: false, emailError: false }
      : {
          email: true,
          emailError: "Please enter a valid email address",
        };
  },

  password: (value) => {
    return passwordRegex.test(value)
      ? { password: false, passwordError: false }
      : {
          password: true,
          passwordError:
            "Minimum 8 characters, 1 uppercase, 1 lowercase, 1 symbol (@$%#^&*), 1 number (0-9).",
        };
  },

  confirmPassword: (value, password) => {
    return passwordRegex.test(value)
      ? value !== password
        ? {
            confirmPassword: true,
            confirmPasswordError: "Password does not match",
          }
        : { confirmPassword: false, confirmPasswordError: false }
      : {
          confirmPassword: true,
          confirmPasswordError:
            "Minimum 8 characters, 1 uppercase, 1 lowercase, 1 symbol (@$%#^&*), 1 number (0-9).",
        };
  },

  initialValue: {
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  },
};

export default validate;
