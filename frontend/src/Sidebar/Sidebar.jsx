import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/Logo02.png";
import { IoHome } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import { FaBuildingUser } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { LiaUserTagSolid } from "react-icons/lia";
import { BiSolidReport } from "react-icons/bi";
import { AiTwotoneReconciliation } from "react-icons/ai";

const Sidebar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const userToken = localStorage.getItem("token");
  const userPermission = localStorage.getItem("permission");
  const track_dept_tickets = parseInt(localStorage.getItem("track_department_tickets"));
  const track_site_tickets = parseInt(localStorage.getItem("track_site_tickets"));
  // console.log(userPermission);

  const [showTickets, setShowTickets] = useState(false);
  // const [showRoles, setShowRoles] = useState(false);
  // const [showSites, setShowSites] = useState(false);
  // const [showUsers, setShowUsers] = useState(false);
  // const [showDepartment, setShowDepartment] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("permission");
    localStorage.removeItem("token");
    localStorage.removeItem("associatedSites");
    localStorage.removeItem("user_name");
    localStorage.removeItem("raise_tickets");
    localStorage.removeItem("ticketPermission");
    localStorage.removeItem("track_department_tickets");
    localStorage.removeItem("track_site_tickets");
    window.location.reload(navigate("/"));
    // navigate("/")
  };

  const sidebarHandler = () => {
    setOpen((prev) => !prev);
  };

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className={`bg-[#257180] absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${
        open ? "w-[250px]" : "md:w-0"
      } overflow-y-hidden overflow-x-hidden z-50 w-[10%] lg:min-w-[22%] lg:max-w-[22%] xl:min-w-[19.5%] xl:max-w-[20%] 2xl:min-w-[13.5%] max-[14%]`}
    >
      {/* Sidebar Content */}
      <div className="relative lg:h-[10%] w-full flex justify-start items-center">
        <img src={logo} className="lg:h-[50px] 2xl:h-[56px] lg:-mt-[15px] 2xl:-mt-10 w-full bg-white" />
        <div className="text-wrap flex items-center justify-between">
          <IoMdClose
            onClick={sidebarHandler}
            size={25}
            className="text-white absolute right-5 cursor-pointer lg:hidden"
          />
        </div>
      </div>

      <nav className="absolute h-full w-full flex flex-col justify-start items-start">
        <ul className="relative top-0 p-0 h-[65%] w-full flex flex-col items-start">
          <div className="absolute flex flex-col gap-2 h-full w-full">
            <span className="w-full">
              <h5 className="text-left ml-3 text-[#F8E1B7]">GENERAL</h5>
            </span>
            <NavLink
              to={userToken ? "/dashboard" : "/"}
              className={({ isActive }) =>
                `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                  isActive ? "text-black" : "text-white"
                } font-medium text-nowrap cursor-pointer no-underline ${
                  isActive ? "bg-slate-100" : ""
                }`
              }
              onClick={() => navigate("/dashboard")}
            >
              <IoHome size={25} />
              Dashboard
            </NavLink>

            <NavLink
              to="/mytickets"
              className={({ isActive }) =>
                `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                  isActive ? "text-black" : "text-white"
                } font-medium text-nowrap cursor-pointer no-underline ${
                  isActive ? "bg-slate-100" : ""
                }`
              }
              onClick={() => {
                setShowTickets((prev) => !prev);
              }}
            >
              <IoTicketOutline size={25} />
              {userPermission == 0 ? "My Tickets" : "All Tickets"}
              {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className={`MuiBox-root cursor-pointer transition-all ${
                showTickets ? "rotate-180" : ""
              } duration-300 -ml-4`}
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10l5 5l5-5"
              ></path>
            </svg> */}
            </NavLink>

            {userPermission == 0 && (
              <NavLink
                to="/assignedtickets"
                className={({ isActive }) =>
                  `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                    isActive ? "text-black" : "text-white"
                  } font-medium text-nowrap cursor-pointer no-underline ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
              >
                <LiaUserTagSolid size={25} />
                Assigned Tickets
              </NavLink>
            )}

          {track_dept_tickets === 1 ?
          <NavLink to="/othertickets" className={({ isActive }) =>
          `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
            isActive ? "text-black" : "text-white"
          } font-medium text-nowrap cursor-pointer no-underline ${
            isActive ? "bg-slate-100" : ""
          }`
        }><AiTwotoneReconciliation size={25}/>Departmental Tickets</NavLink>:""}

          {track_site_tickets === 1 ?
          <NavLink to="/sitegeneratedtickets" className={({ isActive }) =>
          `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
            isActive ? "text-black" : "text-white"
          } font-medium text-nowrap cursor-pointer no-underline ${
            isActive ? "bg-slate-100" : ""
          }`
        }><BiSolidReport size={25}/>Site Generated Tickets</NavLink>:""}

            {/* {showTickets && (
            <div className="h-auto w-full p-2 lg:ml-[70%] lg:-mt-8 xl:-mt-10 flex flex-col">
              <NavLink
                to="/addTicket"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Add Ticket
              </NavLink>
              <NavLink
                to="/allTickets"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                All Tickets
              </NavLink>
              <NavLink
                to="/ticket-detail"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Ticket Details
              </NavLink>
            </div>
          )} */}

            {userPermission === "1" ? (
              <span className="w-full">
                <h5 className="text-left mt-2 ml-3 text-[#F8E1B7]">
                  ADMINISTRATION
                </h5>
              </span>
            ) : (
              <></>
            )}
            {userPermission === "1" ? (
              <NavLink
                to="/alldepartments"
                className={({ isActive }) =>
                  `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                    isActive ? "text-black" : "text-white"
                  } font-medium text-nowrap cursor-pointer no-underline ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
                // onClick={() => setShowDepartment((prev) => !prev)}
              >
                <FaBuildingUser size={25} />
                Manage Department
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className={`MuiBox-root cursor-pointer transition-all ${
                showDepartment ? "rotate-180" : ""
              } duration-300 -ml-4`}
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10l5 5l5-5"
              ></path>
            </svg> */}
              </NavLink>
            ) : (
              <></>
            )}

            {/* {showUsers && (
            <div className="h-auto w-full p-2 lg:ml-[70%] lg:-mt-8 xl:-mt-10 flex flex-col">
              <NavLink
                to="/adduser"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Add User
              </NavLink>
              <NavLink
                to="/allusers"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                View Users
              </NavLink>
            </div>
          )} */}

            {userPermission === "1" ? (
              <NavLink
                to="/allroles"
                className={({ isActive }) =>
                  `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                    isActive ? "text-black" : "text-white"
                  } font-medium text-nowrap cursor-pointer no-underline ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
                // onClick={() => setShowRoles((prev) => !prev)}
              >
                <FaUserTie size={25} />
                Manage Roles
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className={`MuiBox-root cursor-pointer transition-all ${
                showRoles ? "rotate-180" : ""
              } duration-300 -ml-4`}
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10l5 5l5-5"
              ></path>
            </svg> */}
              </NavLink>
            ) : (
              <></>
            )}

            {/* {showRoles && (
            <div className="h-auto w-full p-2 lg:ml-[70%] lg:-mt-8 xl:-mt-10 flex flex-col">
              <NavLink
                to="/addroles"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Add Role
              </NavLink>
              <NavLink
                to="/allroles"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                View Roles
              </NavLink>
            </div>
          )} */}

            {userPermission === "1" ? (
              <NavLink
                to="/allsites"
                className={({ isActive }) =>
                  `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                    isActive ? "text-black" : "text-white"
                  } font-medium text-nowrap cursor-pointer no-underline ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
                // onClick={() => setShowSites((prev) => !prev)}
              >
                <FaMapLocationDot size={25} />
                Manage Sites
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className={`MuiBox-root cursor-pointer transition-all ${
                showSites ? "rotate-180" : ""
              } duration-300 -ml-4`}
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10l5 5l5-5"
              ></path>
            </svg> */}
              </NavLink>
            ) : (
              <></>
            )}

            {/* {showSites && (
            <div className="h-auto w-full p-2 lg:ml-[70%] lg:-mt-8 xl:-mt-10 flex flex-col">
              <NavLink
                to="/addsites"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Add Site
              </NavLink>
              <NavLink
                to="/allsites"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                View Sites
              </NavLink>
            </div>
          )} */}

            {userPermission === "1" ? (
              <NavLink
                to="/allusers"
                className={({ isActive }) =>
                  `w-full py-2 flex items-center px-4 gap-4 lg:text-sm xl:text-base ${
                    isActive ? "text-black" : "text-white"
                  } font-medium text-nowrap cursor-pointer no-underline ${
                    isActive ? "bg-slate-100" : ""
                  }`
                }
                // onClick={() =>{setShowUsers((prev) => !prev)}}
              >
                <MdOutlineGroups size={25} />
                Manage Users
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className={`MuiBox-root cursor-pointer transition-all ${
                showUsers ? "rotate-180" : ""
              } duration-300 -ml-4`}
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 10l5 5l5-5"
              ></path>
            </svg> */}
              </NavLink>
            ) : (
              <></>
            )}

            {/* {showDepartment && (
            <div className="h-auto w-full p-2 lg:ml-[70%] lg:-mt-8 xl:-mt-10 flex flex-col">
              <NavLink
                to="/adddepartment"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                Add Department
              </NavLink>
              <NavLink
                to="/alldepartments"
                className="text-sm font-medium text-white list-item list-disc cursor-pointer no-underline"
              >
                View Departments
              </NavLink>
            </div>
          )} */}

            <NavLink
              to={"/"}
              onClick={handleLogout}
              className="flex gap-4 lg:text-sm xl:text-base text-white font-medium px-4 py-2 rounded-lg cursor-pointer no-underline mb-[20%]"
            >
              <IoMdExit size={25} />
              Logout
            </NavLink>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
