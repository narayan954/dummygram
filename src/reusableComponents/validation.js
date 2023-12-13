const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = {
  name: (value) => {
    if (!value) return { name: true, nameError: "Name field cannot be empty" };
    else {
      return value.length < 4
        ? {
            name: true,
            nameError: "Name must be atleast 4 characters long.",
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
            "Minimum 6 characters, At least one letter (either lowercase or uppercase) ,At least one digit (0-9).",
        };
  },

  confirmPassword: (value, password) => {
    return value !== password
      ? {
          confirmPassword: true,
          confirmPasswordError: "Password does not match",
        }
      : { confirmPassword: false, confirmPasswordError: false };
  },

  initialValue: {
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  },
};

export default validate;
