import profile from "../assets/profile.png";
// import { IoIosNotifications } from "react-icons/io";

const Header = ({ toggleSidebar }) => {
  const username = localStorage.getItem("user_name");
  const department_name = localStorage.getItem("user_department_name");
  // console.log(username);

  return (
    <div className="absolute top-0 w-full max-h-[8vh] py-2 bg-white shadow-md flex items-center justify-between z-40">
      <div className="flex items-center gap-2">
        <button
          className="h-full w-16 cursor-pointer"
          onClick={toggleSidebar} // Toggle the sidebar on click
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="iconify iconify--ic MuiBox-root css-0 h-full w-8 md:hidden"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Right section (notifications and profile) */}
      <div className="flex items-center gap-4">
        {/* <IoIosNotifications className="h-8 w-8 cursor-pointer" /> */}
        <p className="text-black text-center font-medium border-r-[2px] border-black p-2 my-auto">
          Welcome, <span className="text-red-600">{username}</span> ({department_name})
        </p>
        <img
          // onClick={console.log(username)}
          src={profile}
          className="w-10 h-10 rounded-full cursor-pointer"
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default Header;
