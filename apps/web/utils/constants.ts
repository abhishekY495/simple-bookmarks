import {
  GalleryVerticalEndIcon,
  HashIcon,
  HeartIcon,
  LayoutDashboardIcon,
  SearchIcon,
  FolderOpenIcon,
  UserIcon,
} from "lucide-react";

export const API_URL =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL
    : process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export const DICEBEAR_API_URL = "https://api.dicebear.com/9.x";

export const TAKE_VALUE = 21;

export const NAV_ITEMS = [
  { href: "/my/all", label: "All", icon: GalleryVerticalEndIcon },
  { href: "/my/unsorted", label: "Unsorted", icon: LayoutDashboardIcon },
  { href: "/my/search", label: "Search", icon: SearchIcon },
  { href: "/my/favorites", label: "Favorites", icon: HeartIcon },
  { href: "/my/collections", label: "Collections", icon: FolderOpenIcon },
  { href: "/my/tags", label: "Tags", icon: HashIcon },
  { href: "/my/account", label: "Account", icon: UserIcon },
];

export const QUERY_KEYS = {
  getUnsortedBookmarks: ["getUnsortedBookmarks"],
  getAllBookmarks: ["getAllBookmarks"],
  getFavoritesBookmarks: ["getFavoritesBookmarks"],
};
