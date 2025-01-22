import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";

const UserDetail = () => {
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Users", href: "/allusers" },
    { label: "User Detail", active: true },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Destructuring row from location.state, defaulting to an empty object in case it's undefined
  const { row } = location.state || {};
  // console.log(row);

  if (!row) {
    return <div>No user data available.</div>; // Handle case if row is undefined or not passed.
  }

  // Ensure row.user_site_names is an array (if it's not already)
  const userSites = Array.isArray(row.user_site_names)
    ? row.user_site_names
    : [row.user_site_names];

  return (
    <div className="absolute w-full h-full flex flex-col items-start">
      {/* <Sidebar /> */}
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-[98.5%] relative">
        <BreadCrumb items={breadItems} />
        <button
          className="bg-[#000] text-white absolute top-1 right-0 font-semibold px-4 py-1 rounded-md"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center">
        <form className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]">
          <div className="grid">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7]">
              <span className="ml-6">User Details & Permissions</span>
            </div>
            {/* <div className="flex-1 px-3 pt-3">
              <p className="text-2xl underline underline-offset-8">
                User details
              </p>
            </div> */}
            {/* Priority Inputs */}
            <div className="flex-1 max-sm:flex-col grid grid-cols-2 px-4 gap-3 mt-2">
              {/* User Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="user_name"
                  className="text-base font-medium text-black col-span-1"
                >
                  Name
                </label>
                <label className="w-full bg-white border-[1px] border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md">
                  {row.user_name}
                </label>
              </div>

              {/* User Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="user_email"
                  className="text-base font-medium text-black col-span-1"
                >
                  Email
                </label>
                <label className="w-full border-[1px] bg-white border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md">
                  {row.user_email}
                </label>
              </div>

              {/* User Role */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="role_id"
                  className="text-base font-medium text-black col-span-1"
                >
                  Role
                </label>
                <label className="w-full border-[1px] bg-white border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md">
                  {row.user_role_name}
                </label>
              </div>

              {/* User Department */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="department_id"
                  className="text-base font-medium text-black col-span-1"
                >
                  Department
                </label>
                <label className="w-full border-[1px] bg-white border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md">
                  {row.user_department_name}
                </label>
              </div>
            </div>
          </div>
          <hr className="h-[1px] w-full bg-gray-500 place-items-center" />
          <div className="grid">
            <div className="flex-1 max-sm:flex-col px-4 py-1 gap-3 -mt-3">
              {/* User Associated Sites */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="associated_sites"
                  className="text-base font-medium text-black col-span-1 underline underline-offset-4"
                >
                  Associated Site/Sites
                </label>
                <div className="col-span-2 flex gap-3 flex-wrap items-start justify-start">
                  {userSites.length > 0 ? (
                    userSites.map((site, index) => (
                      <span
                        key={index}
                        className="text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 mr-2"
                      >
                        {site}
                      </span>
                    ))
                  ) : (
                    <span>No Sites associated.</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 px-3 mt-2">
              <p className="text-base font-medium underline underline-offset-4 px-2">
                User settings & Permissions
              </p>
              <div className="flex gap-5 -mt-3">
                <p className="pl-[8px]">
                  <span className="font-normal">(i) Can Raise Tickets: </span>
                  {row.user_can_raise_new_ticket === "1" ? (
                    <span
                      className={`${
                        row.user_can_raise_new_ticket === "1"
                          ? "text-green-600 font-medium tracking-wider"
                          : "text-red-600 font-medium tracking-wider"
                      }`}
                    >
                      Yes
                    </span>
                  ) : (
                    <span
                      className={`${
                        row.user_can_raise_new_ticket === "1"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      No
                    </span>
                  )}
                </p>
                <p className="pl-3">
                  <span className="font-normal">
                    (ii) Can Track Site Generated Tickets:{" "}
                  </span>
                  {row.user_can_track_site_tickets === "1" ? (
                    <span
                      className={`${
                        row.user_can_track_site_tickets === "1"
                          ? "text-green-600 font-medium tracking-wider"
                          : "text-red-600 font-medium tracking-wider"
                      }`}
                    >
                      Yes
                    </span>
                  ) : (
                    <span
                      className={`${
                        row.user_can_track_site_tickets === "1"
                          ? "text-green-600 font-medium tracking-wider"
                          : "text-red-600 font-medium tracking-wider"
                      }`}
                    >
                      No
                    </span>
                  )}
                </p>
                <p className="pl-3">
                  <span className="font-normal">
                    (iii) Can Track Departmental Tickets:{" "}
                  </span>
                  {row.user_can_track_department_tickets === "1" ? (
                    <span
                      className={`${
                        row.user_can_track_department_tickets === "1"
                          ? "text-green-600 font-medium tracking-wider"
                          : "text-red-600 font-medium tracking-wider"
                      }`}
                    >
                      Yes
                    </span>
                  ) : (
                    <span
                      className={`${
                        row.user_can_track_department_tickets === "1"
                          ? "text-green-600 font-medium tracking-wider"
                          : "text-red-600 font-medium tracking-wider"
                      }`}
                    >
                      No
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Submit and Reset buttons */}
          <div className="flex justify-between p-4 py-1">
            <div>
              {/* <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md"
                type="submit"
              >
                Update
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetail;
