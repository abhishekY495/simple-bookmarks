export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL
    : process.env.PROD_BACKEND_URL;

export const DICEBEAR_API_URL =
  "https://api.dicebear.com/9.x/initials/png?backgroundColor=00ACC1";
