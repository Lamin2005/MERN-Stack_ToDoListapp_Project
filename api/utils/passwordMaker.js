import bcyrpt from "bcrypt";

const Password = {
  encode: async (password) => {
    return await bcyrpt.hash(password, 10);
  },

  compare: async (password, hash) => {
    return await bcyrpt.compare(password, hash);
  },
};

export default Password;
