export const QuickAddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-snaptrack-main text-white p-2 fixed bottom-5 right-5 rounded-3xl w-16 h-16 text-2xl flex items-center justify-center hover:bg-snaptrack-dark shadow-lg"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-12 h-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
};
