import { DICEBEAR_API_URL } from "./constants";

export const getAvatar = (email: string) => {
  return `${DICEBEAR_API_URL}/initials/png?backgroundColor=00ACC1&seed=${email}`;
};
