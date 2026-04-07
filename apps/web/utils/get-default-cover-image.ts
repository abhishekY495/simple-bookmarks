import { DICEBEAR_API_URL } from "./constants";

export const getDefaultCoverImage = (seed: string) => {
  return `${DICEBEAR_API_URL}/glass/png?seed=${seed}`;
};
