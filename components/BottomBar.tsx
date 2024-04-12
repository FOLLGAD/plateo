"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const home = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.5 13.85V15C27.4985 17.6955 26.6256 20.3183 25.0117 22.4773C23.3977 24.6362 21.1291 26.2156 18.5442 26.9799C15.9593 27.7442 13.1966 27.6524 10.6681 26.7182C8.1396 25.7841 5.98082 24.0576 4.5137 21.7963C3.04658 19.535 2.34974 16.8601 2.5271 14.1704C2.70445 11.4807 3.74651 8.92041 5.49785 6.87134C7.24919 4.82227 9.61598 3.39423 12.2452 2.80018C14.8745 2.20614 17.6253 2.47792 20.0875 3.575"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5 5L15 17.5125L11.25 13.7625"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const b = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.06606 5.31934C10.1175 3.09939 12.3783 1.5625 15 1.5625C17.6217 1.5625 19.8825 3.09939 20.9339 5.31934C21.0388 5.3148 21.1441 5.3125 21.25 5.3125C25.2195 5.3125 28.4375 8.53045 28.4375 12.5C28.4375 15.2257 26.9204 17.5953 24.6875 18.8135V22.565C24.6875 23.6881 24.6876 24.6246 24.5876 25.3681C24.4821 26.1529 24.25 26.8614 23.6806 27.4306C23.1114 28 22.4029 28.2321 21.6181 28.3376C20.8746 28.4376 19.9381 28.4375 18.815 28.4375H11.185C10.0619 28.4375 9.12538 28.4376 8.3819 28.3376C7.59716 28.2321 6.88866 28 6.31932 27.4306C5.74999 26.8614 5.5179 26.1529 5.41239 25.3681C5.31242 24.6246 5.31246 23.6881 5.3125 22.565V18.8135C3.07964 17.5953 1.5625 15.2257 1.5625 12.5C1.5625 8.53045 4.78045 5.3125 8.75 5.3125C8.85586 5.3125 8.96124 5.3148 9.06606 5.31934ZM8.50327 7.19312C5.6838 7.32202 3.4375 9.64869 3.4375 12.5C3.4375 14.677 4.74711 16.5503 6.62535 17.3709C6.96681 17.52 7.1875 17.8574 7.1875 18.23V22.5C7.1875 23.705 7.18949 24.5145 7.27067 25.1183C7.34822 25.6951 7.48225 25.942 7.64515 26.1049C7.80804 26.2677 8.05491 26.4018 8.63174 26.4794C9.23554 26.5605 10.045 26.5625 11.25 26.5625H18.75C19.955 26.5625 20.7645 26.5605 21.3683 26.4794C21.9451 26.4018 22.192 26.2677 22.3549 26.1049C22.5177 25.942 22.6518 25.6951 22.7294 25.1183C22.8105 24.5145 22.8125 23.705 22.8125 22.5V18.23C22.8125 17.8574 23.0331 17.52 23.3746 17.3709C25.2529 16.5503 26.5625 14.677 26.5625 12.5C26.5625 9.64869 24.3162 7.32201 21.4967 7.19312C21.5401 7.49781 21.5625 7.80898 21.5625 8.125V8.75C21.5625 9.26776 21.1427 9.6875 20.625 9.6875C20.1073 9.6875 19.6875 9.26776 19.6875 8.75V8.125C19.6875 7.59644 19.6004 7.09015 19.4405 6.61858C18.8127 4.76752 17.0605 3.4375 15 3.4375C12.9395 3.4375 11.1873 4.76752 10.5595 6.61858C10.3996 7.09015 10.3125 7.59644 10.3125 8.125V8.75C10.3125 9.26776 9.89276 9.6875 9.375 9.6875C8.85724 9.6875 8.4375 9.26776 8.4375 8.75V8.125C8.4375 7.80896 8.4599 7.49781 8.50327 7.19312ZM10.3125 22.5C10.3125 21.9823 10.7322 21.5625 11.25 21.5625H18.75C19.2677 21.5625 19.6875 21.9823 19.6875 22.5C19.6875 23.0177 19.2677 23.4375 18.75 23.4375H11.25C10.7322 23.4375 10.3125 23.0177 10.3125 22.5Z"
      strokeWidth="1"
    />
  </svg>
);

const stats = (
  <svg
    width="32"
    height="27"
    viewBox="0 0 32 27"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      d="M1 26.7323L3.79562 16.5302C4.22996 14.9452 6.28461 14.5315 7.29853 15.8249L10.237 19.5734C11.2917 20.9189 13.439 20.4065 13.7726 18.7298L16.9662 2.67667C17.382 0.586529 20.3427 0.509655 20.8664 2.5754L26.0275 22.9326C26.4957 24.7792 29.0357 24.9877 29.7987 23.2422L31 20.4942"
      strokeWidth="2"
    />
  </svg>
);

const d = (
  <svg
    width="29"
    height="28"
    viewBox="0 0 29 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.2127 10.5584H18.0484V2.77935C21.2603 3.61317 23.963 5.78134 25.3967 8.7324C25.6096 9.17312 26.1497 9.36136 26.6051 9.15318C27.0582 8.94611 27.2539 8.42345 27.041 7.98494C25.1965 4.19342 21.5509 1.51477 17.292 0.822681C17.0254 0.781709 16.7588 0.851472 16.554 1.01757C16.3503 1.18589 16.2336 1.43061 16.2336 1.68973V11.4376C16.2336 11.9237 16.6387 12.3168 17.141 12.3168H27.2127C27.715 12.3168 28.1212 11.9237 28.1212 11.4376C28.1212 10.9526 27.715 10.5584 27.2127 10.5584ZM23.5808 14.8859H13.5927V8.11118C13.5927 7.62727 13.1865 7.23306 12.6841 7.23306C12.1818 7.23306 11.7756 7.62727 11.7756 8.11118V15.7651C11.7756 16.2512 12.1818 16.6432 12.6841 16.6432H22.6322C22.1734 21.5642 17.887 25.4311 12.6841 25.4311C7.17685 25.4311 2.69597 21.0947 2.69597 15.7651C2.69597 10.4344 7.17685 6.09804 12.6841 6.09804C13.1865 6.09804 13.5927 5.70383 13.5927 5.21992C13.5927 4.7338 13.1865 4.34069 12.6841 4.34069C6.17564 4.34069 0.878906 9.46545 0.878906 15.7651C0.878906 22.0636 6.17564 27.1884 12.6841 27.1884C19.1938 27.1884 24.4882 22.0636 24.4882 15.7651C24.4882 15.279 24.0831 14.8859 23.5808 14.8859Z"
      strokeWidth="0.5"
    />
  </svg>
);

export const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeRoute: "Home" | "Meal" | "Stats" | "Snap" | "Generate" =
    useMemo(() => {
      if (pathname === "/") return "Home";
      if (pathname.startsWith("/meals")) return "Meal";
      if (pathname === "/stats") return "Stats";
      if (pathname === "/snap") return "Snap";
      if (pathname === "/gen" || pathname.startsWith("/recipes"))
        return "Generate";
      return "Home";
    }, [pathname]);

  // bottom app nav bar
  return (
    <div className="flex justify-between items-center w-full px-4 py-2 pb-8 bg-white fixed bottom-0 left-0 right-0 stroke-[#ACE4AA] fill-[#ACE4AA] shadow-[0_-4px_8px_0_rgba(0,0,0,0.1)] py-4 px-6 z-50">
      <div
        className={cn("flex items-center gap-4", {
          "stroke-[#408B4B]": activeRoute === "Home",
          "fill-[#408B4B]": activeRoute === "Home",
        })}
        onClick={() => router.push("/")}
      >
        {home}
      </div>
      <div
        className={cn("flex items-center gap-4", {
          "stroke-[#408B4B]": activeRoute === "Generate",
          "fill-[#408B4B]": activeRoute === "Generate",
        })}
        onClick={() => router.push("/gen")}
      >
        {b}
      </div>
      <div className="w-0 relative">
        <div
          className={cn(
            "-translate-x-1/2 -translate-y-[80%] absolute top-0 left-0 stroke-none",
            {
              hidden: pathname === "/snap",
            }
          )}
          onClick={() => router.push("/snap")}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="36" r="36" fill="#408B4B" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.625 29.7083C25.625 30.1172 25.4626 30.5093 25.1735 30.7985C24.8843 31.0876 24.4922 31.25 24.0833 31.25C23.6745 31.25 23.2823 31.0876 22.9932 30.7985C22.7041 30.5093 22.5417 30.1172 22.5417 29.7083V26.5063C22.5417 25.3346 22.6681 24.6794 23.0335 23.998C23.3772 23.352 23.8937 22.8356 24.5397 22.4918C25.2211 22.1264 25.8747 22 27.048 22H30.25C30.6589 22 31.051 22.1624 31.3401 22.4515C31.6292 22.7407 31.7917 23.1328 31.7917 23.5417C31.7917 23.9505 31.6292 24.3427 31.3401 24.6318C31.051 24.9209 30.6589 25.0833 30.25 25.0833H27.048C26.3403 25.0833 26.1692 25.1172 25.9935 25.2097C25.8895 25.2633 25.8049 25.3479 25.7514 25.4518C25.6589 25.626 25.625 25.7987 25.625 26.5063V29.7083ZM30.25 46.6667C30.6589 46.6667 31.051 46.8291 31.3401 47.1182C31.6292 47.4073 31.7917 47.7995 31.7917 48.2083C31.7917 48.6172 31.6292 49.0093 31.3401 49.2985C31.051 49.5876 30.6589 49.75 30.25 49.75H27.048C25.8763 49.75 25.2211 49.6236 24.5397 49.2582C23.8987 48.9174 23.3743 48.3929 23.0335 47.752C22.6681 47.0706 22.5417 46.4169 22.5417 45.2437V42.0417C22.5417 41.6328 22.7041 41.2407 22.9932 40.9515C23.2823 40.6624 23.6745 40.5 24.0833 40.5C24.4922 40.5 24.8843 40.6624 25.1735 40.9515C25.4626 41.2407 25.625 41.6328 25.625 42.0417V45.2437C25.625 45.9513 25.6589 46.1225 25.7514 46.2982C25.81 46.4061 25.8855 46.4832 25.9935 46.5402C26.1677 46.6327 26.3403 46.6667 27.048 46.6667H30.25ZM41.0417 23.5417C41.0417 23.9505 41.2041 24.3427 41.4932 24.6318C41.7823 24.9209 42.1745 25.0833 42.5833 25.0833H45.7854C46.493 25.0833 46.6641 25.1172 46.8399 25.2097C46.9478 25.2683 47.0249 25.3439 47.0819 25.4518C47.1744 25.626 47.2083 25.7987 47.2083 26.5063V29.7083C47.2083 30.1172 47.3708 30.5093 47.6599 30.7985C47.949 31.0876 48.3411 31.25 48.75 31.25C49.1589 31.25 49.551 31.0876 49.8401 30.7985C50.1292 30.5093 50.2917 30.1172 50.2917 29.7083V26.5063C50.2917 25.3346 50.1652 24.6794 49.7999 23.998C49.4591 23.3571 48.9346 22.8326 48.2937 22.4918C47.6122 22.1264 46.9586 22 45.7854 22H42.5833C42.1745 22 41.7823 22.1624 41.4932 22.4515C41.2041 22.7407 41.0417 23.1328 41.0417 23.5417ZM47.2083 42.0417C47.2083 41.6328 47.3708 41.2407 47.6599 40.9515C47.949 40.6624 48.3411 40.5 48.75 40.5C49.1589 40.5 49.551 40.6624 49.8401 40.9515C50.1292 41.2407 50.2917 41.6328 50.2917 42.0417V45.2437C50.2917 46.4154 50.1652 47.0706 49.7999 47.752C49.459 48.3929 48.9345 48.9173 48.2937 49.2582C47.6122 49.6236 46.9586 49.75 45.7854 49.75H42.5833C42.1745 49.75 41.7823 49.5876 41.4932 49.2985C41.2041 49.0093 41.0417 48.6172 41.0417 48.2083C41.0417 47.7995 41.2041 47.4073 41.4932 47.1182C41.7823 46.8291 42.1745 46.6667 42.5833 46.6667H45.7854C46.493 46.6667 46.6641 46.6327 46.8399 46.5402C46.9439 46.4868 47.0285 46.4022 47.0819 46.2982C47.1744 46.124 47.2083 45.9513 47.2083 45.2437V42.0417ZM22.5417 34.3333C22.1328 34.3333 21.7407 34.4958 21.4515 34.7849C21.1624 35.074 21 35.4661 21 35.875C21 36.2839 21.1624 36.676 21.4515 36.9651C21.7407 37.2542 22.1328 37.4167 22.5417 37.4167H50.2917C50.7005 37.4167 51.0927 37.2542 51.3818 36.9651C51.6709 36.676 51.8333 36.2839 51.8333 35.875C51.8333 35.4661 51.6709 35.074 51.3818 34.7849C51.0927 34.4958 50.7005 34.3333 50.2917 34.3333H22.5417Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-4", {
          "stroke-[#408B4B]": activeRoute === "Stats",
          "fill-[#408B4B]": activeRoute === "Stats",
        })}
        onClick={() => router.push("/stats")}
      >
        {stats}
      </div>
      <div
        className={cn("flex items-center gap-4", {
          "stroke-[#408B4B]": activeRoute === "Meal",
          "fill-[#408B4B]": activeRoute === "Meal",
        })}
      >
        {d}
      </div>
    </div>
  );
};