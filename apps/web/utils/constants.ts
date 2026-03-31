export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? process.env.DEV_BACKEND_URL
    : process.env.PROD_BACKEND_URL;
