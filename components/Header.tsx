import { useRouter } from "next/navigation";
import React from "react";

const LeftArrow = () => (
  <svg
    width="25"
    height="31"
    viewBox="0 0 25 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.585786 14.0858C-0.195262 14.8668 -0.195262 16.1332 0.585786 16.9142L13.3137 29.6421C14.0948 30.4232 15.3611 30.4232 16.1421 29.6421C16.9232 28.8611 16.9232 27.5948 16.1421 26.8137L4.82843 15.5L16.1421 4.18629C16.9232 3.40524 16.9232 2.13891 16.1421 1.35786C15.3611 0.576816 14.0948 0.576816 13.3137 1.35786L0.585786 14.0858ZM23 17.5C24.1046 17.5 25 16.6046 25 15.5C25 14.3954 24.1046 13.5 23 13.5V17.5ZM2 17.5H23V13.5H2V17.5Z"
      fill="#B8BDC8"
    />
  </svg>
);

const Header = ({ backlinkUrl }: { backlinkUrl?: string }) => {
  const router = useRouter();

  return (
    <>
      <header className="flex justify-between items-center p-8 text-gray-800">
        <button
          className="text-xl"
          onClick={() =>
            backlinkUrl ? router.push(backlinkUrl) : router.back()
          }
        >
          <LeftArrow />
        </button>
      </header>
    </>
  );
  //   return (
  //     <header className="flex justify-between items-center p-5 bg-snaptrack-main text-white">
  //       <h1 className="text-2xl font-bold">SnapTrack</h1>
  //       <nav>
  //         <ul className="flex space-x-4">
  //           <li>
  //             <Link href="/">Home</Link>
  //           </li>
  //           <li>
  //             <Link href="/snap">Snap</Link>
  //           </li>
  //         </ul>
  //       </nav>
  //     </header>
  //   );
};

export default Header;
