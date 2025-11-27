
export const generateOtp = () => {
    const token = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(token)
    return token;
  } 