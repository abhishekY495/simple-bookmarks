import { DICEBEAR_API_URL } from "./constants";

export const getDefaultCoverImage = (url: string) => {
  return `${DICEBEAR_API_URL}/glass/png?seed=${url}`;
};
