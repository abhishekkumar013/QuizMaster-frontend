export const getUserInitial = (user: any) => {
  if (user?.name) {
    return user.name.charAt(0).toUpperCase();
  }
  return "U";
};
