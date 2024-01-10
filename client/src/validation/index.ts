export const emailPattern = {
  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  message: "Invalid email format",
};

export const setRequired = (msg: string) => ({
  value: true,
  message: msg,
});

export const passwordLength = {
  value: 6,
  message: "Password must be 6 length minium.",
};
