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
  getCollections: ["getCollections"],
  getTags: ["getTags"],
  getCount: ["getCount"],
  getCollectionById: ["getCollectionById"],
  getTagById: ["getTagById"],
  search: ["search"],
  getPublicCollectionById: ["getPublicCollectionById"],
};

export const DEBOUNCE_TIME = 400;
export const BOOKMARK_PARSING_INTERVAL = 3000;

const SHARED_COLLECTION_LINK =
  "https://simple-bookmarks-495.vercel.app/collection/public/eeac88fb-d2ec-4004-9f93-90135d37576e";
export const FEATURES = [
  {
    name: "Collections",
    description:
      "Collections are like folders, group related items together so you always know where things are.",
    imagePath: "/home-page/features/collections.png",
  },
  {
    name: "Tags",
    description:
      "A bookmark lives in one collection, but tags let you label it with multiple keywords.",
    imagePath: "/home-page/features/tags.png",
  },
  {
    name: "Rich Preview",
    description:
      "Every bookmark you save is automatically transformed into a rich preview with title and an image so your bookmarks are not just saved, but easy to scan, understand, and revisit anytime.",
    fullWidth: true,
  },
  {
    name: "🌐 Share collections",
    description: `Share your collections with others using a public link. By default, your collections remain private. When you're ready, make any collection public and let others explore your curated links. For example, <a href='${SHARED_COLLECTION_LINK}' target='_blank' style='color: #007bff; text-decoration: 1px solid underline; font-weight: 500; text-underline-offset: 4px;'>this collection</a> is publicly accessible.`,
    fullWidth: true,
  },
];

export const RICH_PREVIEW_BOOKMARKS = [
  {
    url: "https://letterboxd.com/film/ready-player-one/",
    domain: "letterboxd.com",
    title: "Ready Player One (2018)",
    cover:
      "https://a.ltrbxd.com/resized/sm/upload/55/qw/ol/78/ready-player-one-1200-1200-675-675-crop-000000.jpg?v=bb291b3306",
    tags: ["sci-fi", "adventure", "action"],
  },
  {
    url: "https://www.stumbleguys.com/",
    domain: "stumbleguys.com",
    title: "Stumble Guys",
    cover: "https://www.stumbleguys.com/og.jpg",
    tags: ["game"],
  },
  {
    url: "https://www.youtube.com/watch?v=bAUVCn_jw5I",
    domain: "youtube.com",
    title: "Why Starting A Rocket Engine Is So Hard!",
    cover: "https://i.ytimg.com/vi/bAUVCn_jw5I/maxresdefault.jpg",
    tags: ["space", "rocket"],
  },
  {
    url: "https://github.com/shadcn-ui/ui/issues/1748",
    domain: "github.com",
    title:
      "Combobox in a form in a dialog isn't working.  · Issue #1748 · shadcn-ui/ui",
    cover:
      "https://opengraph.githubassets.com/a5a5c5a14724e334dfeafe21fd704a998874c223d7e2b4efefa0ee30238d09d8/shadcn-ui/ui/issues/1748",
    tags: ["github"],
  },
  {
    url: "https://www.youtube.com/watch?v=yFNHDxDcl28",
    domain: "youtube.com",
    title: "Night Moves x Unacceptable Color (Full Session)",
    cover: "https://i.ytimg.com/vi/yFNHDxDcl28/maxresdefault.jpg",
    tags: ["music"],
  },
  {
    url: "https://x.com/hakluke/status/1909413598662639954",
    domain: "x.com",
    title: "Luke Stephens (hakluke) (@hakluke) on X",
    cover:
      "https://pbs.twimg.com/ext_tw_video_thumb/1909413520396955648/pu/img/nOIiM7OkmdbTK1Xw.jpg:large",
    tags: ["security", "resource"],
  },
  {
    url: "https://www.crunchyroll.com/series/G3KHEVMN1/tokyo-revengers",
    domain: "crunchyroll.com",
    title: "Watch Tokyo Revengers - Crunchyroll",
    cover:
      "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/7923a0407dbdba324c56acec9f096c13.jpg",
    tags: ["anime", "action", "drama"],
    collection: null,
  },
  {
    url: "https://www.bugbountydirectory.com/blogs/i-asked-chatgpt-to-bypass-an-xss-filter-here%E2%80%99s-what-happened",
    domain: "bugbountydirectory.com",
    title: "I Asked ChatGPT to Bypass an XSS Filter",
    cover:
      "https://images.unsplash.com/photo-1737644467636-6b0053476bb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGFpfGVufDB8fDB8fHww",
    tags: ["security", "bug-bounty"],
    collection: null,
  },
  {
    url: "https://github.com/abhishekY495/localtube-manager",
    domain: "github.com",
    title: "GitHub - abhishekY495/localtube-manager",
    cover:
      "https://opengraph.githubassets.com/f76387143105a637f2c5e776d81f0230486a6f11d11c8957fca1f654964cea85/abhishekY495/localtube-manager",
    tags: ["github", "open-source"],
    collection: null,
  },
  {
    url: "https://x.com/svpino/status/2030987585842188461",
    domain: "x.com",
    title:
      "Santiago (@svpino) on X: People are lying to you. These agents don't work as they promised.",
    cover:
      "https://pbs.twimg.com/amplify_video_thumb/2030987485426372609/img/Q0em6iBmRFDQkhbc.jpg:large",
    tags: ["twitter", "ai"],
    collection: null,
  },
  {
    id: "91057d53-1eb9-41bd-8a63-9855566444e3",
    url: "https://www.linkedin.com/posts/arnavgupta_so-friends-a-year-long-passion-project-activity-7447804839276818432-IXS9/",
    domain: "linkedin.com",
    title:
      "So friends, a year-long passion project getting closer to seeing light of the day.",
    cover:
      "https://media.licdn.com/dms/image/v2/D4E22AQF_Zmn_m9A2_A/feedshare-shrink_800/B4EZ1vrCKGGYAc-/0/1775695046477?e=2147483647&v=beta&t=nVYy0khiFGH0FG-80AhqwZYqtLkCgcHmJKhm4r1LQf0",
  },
];
