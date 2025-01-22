import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../Tickets/style.css";

const AddUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Users", href: "/allusers" },
    { label: "Add User", active: true },
  ];

  const [raiseTicket, setRaiseTicket] = useState(false);
  const handleRaiseTicket = () => {
    setRaiseTicket((prev) => !prev);
    // console.log(raiseTicket);
  };
  const [trackSiteTicket, setTrackSiteTicket] = useState(false);
  const handleTrackSiteTicket = () => {
    setTrackSiteTicket((prev) => !prev);
    // console.log(trackSiteTicket);
  };
  const [trackDeptTicket, setTrackDeptTicket] = useState(false);
  const handleTrackDeptTicket = () => {
    setTrackDeptTicket((prev) => !prev);
    // console.log(trackDeptTicket);
  };

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    cnf_password: "",
    // can_raise_new_ticket: "",
    // can_track_site_tickets: "",
    // can_track_department_tickets: "",
    department_id: "",
    role_id: "",
    associated_sites: [],
  });

  // const raise_ticket = localStorage.getItem("raise_tickets");
  // const track_site_tickets = localStorage.getItem("track_site_tickets");
  // const track_department_tickets = localStorage.getItem(
  //   "track_department_tickets"
  // );

  const onChangeHandler = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prev) => {
      if (name === "associated_sites") {
        const updatedSites = checked
          ? [...prev.associated_sites, value]
          : prev.associated_sites.filter((siteId) => siteId !== value);

        return { ...prev, associated_sites: updatedSites };
      }
      // else if (type === "button") {
      //   // Convert the boolean toggle to 1 or 0
      //   const newValue = prev[name] === true ? 1 : 0;
      //   return { ...prev, [name]: newValue }; // Store 1 or 0 for the toggles
      // }
      else {
        return { ...prev, [name]: value };
      }
    });
  };

  const [userRole, setUserRole] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}/role/getrolelist/roles`;
      const token = localStorage.getItem("token");
      // console.log(token);
      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success" && res.data.data) {
          setUserRole(res.data.data);
          // console.log(userRole);
        } else {
          // console.log(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchData();
  }, []);

  const [userDept, setUserDept] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}/department/getdepartmentlist/departments`;
      const token = localStorage.getItem("token");
      // console.log(token);
      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success" && res.data.data) {
          setUserDept(res.data.data);
          // console.log(userDept);
        } else {
          // console.log(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchData();
  }, []);

  const [userSite, setUserSite] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}/site/getsitelist/sites`;
      const token = localStorage.getItem("token");
      // console.log(token);
      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success" && res.data.data) {
          setUserSite(res.data.data);
          // console.log(userSite);
        } else {
          // console.log(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchData();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    // console.log(formData);
    const url = `${apiUrl}/user/createuser`;
    const token = localStorage.getItem("token");
    // console.log(raiseTicket);
    // console.log(trackSiteTicket);
    // console.log(trackDeptTicket);

    if (
      !formData.cnf_password ||
      formData.password === "" ||
      formData.cnf_password === ""
    ) {
      return toast.info("Please Enter password");
    }

    // if (formData.user_password === formData.cnf_password) {
    //   try {
    //     const res = await axios.post(
    //       url,
    //       {
    //         user_name: formData.user_name,
    //         user_email: formData.user_email,
    //         user_password: formData.user_password,
    //         can_raise_new_ticket: raiseTicket ? 1 : 0,
    //         can_track_site_tickets: trackSiteTicket ? 1 : 0,
    //         can_track_department_tickets: trackDeptTicket ? 1 : 0,
    //         department_id: formData.department_id,
    //         role_id: formData.role_id,
    //         associated_sites: formData.associated_sites,
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );

    //     if (res.data.status === "success") {
    //       console.log(res);
    //       toast.success(res.data.message, {
    //         icon: true,
    //         position: "top-right",
    //         hideProgressBar: true,
    //       });
    //       setTimeout(() => {
    //         navigate("/allusers");
    //       }, 6000);
    //     } else {
    //       toast.error(res.data.message, {
    //         hideProgressBar: true,
    //         position: "top-right",
    //       });
    //       console.log(res.data.message);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   toast.error("Password doesn't match !", {
    //     hideProgressBar: true,
    //     position: "top-right",
    //   });
    // }
  };

  const handleReset = () => {
    setFormData({
      user_name: "",
      user_email: "",
      user_password: "",
      cnf_password: "",
      can_raise_new_ticket: false,
      can_track_site_tickets: false,
      can_track_department_tickets: false,
      department_id: "",
      role_id: "",
      associated_sites: [],
    });

    setRaiseTicket(false);
    setTrackSiteTicket(false);
    setTrackDeptTicket(false);
  };

  return (
    <div className="w-full flex flex-col items-start">
      {/* <Sidebar /> */}
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-[98.5%] relative">
        <BreadCrumb items={breadItems} />
        <button
          className="bg-[#000] text-white absolute top-1 right-0 font-semibold px-4 py-1 rounded-md"
          type="button"
          onClick={() => navigate("/allusers")}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center overflow-hidden">
        <form
          onSubmit={createUser}
          className="w-full flex flex-col bg-gray-100 filter-[5px]"
        >
          <div className="grid">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7] text-base">
              <span className="ml-6">Add User Details & Permissons</span>
            </div>
            <div className="flex-1 px-3 pt-3">
              {/* <p className="text-2xl underline underline-offset-8">
              </p> */}
            </div>
            {/* Priority Inputs */}
            <div className="flex-1 max-sm:flex-col grid grid-cols-2 px-4 gap-2 -mt-2">
              {/* User Name */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="user_name"
                  className="text-base font-medium text-black text-nowrap col-span-1"
                >
                  Name <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  placeholder="John Doe"
                  onChange={onChangeHandler}
                  name="user_name"
                  value={formData.user_name}
                  required
                />
              </div>

              {/* User Email */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="user_email"
                  className="text-base font-medium text-black text-nowrap col-span-1"
                >
                  Email <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  placeholder="JohnDoe@yahoo.com"
                  onChange={onChangeHandler}
                  name="user_email"
                  value={formData.user_email}
                  required
                />
              </div>

              {/* User Password */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="user_password"
                  className="text-base font-medium text-black text-nowrap col-span-1"
                >
                  Password <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="password"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  placeholder="Password"
                  onChange={onChangeHandler}
                  name="user_password"
                  value={formData.user_password}
                  required
                />
              </div>

              {/* User Confirm Password */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="cnf_password"
                  className="text-base font-medium text-black text-nowrap col-span-1"
                >
                  Confirm Password{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="password"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  placeholder="Re-Enter password"
                  onChange={onChangeHandler}
                  name="cnf_password"
                  value={formData.cnf_password}
                  required
                />
              </div>

              {/* User Role */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="user_role"
                  className="text-base font-medium text-black text-nowrap"
                >
                  User Role <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] rounded-md"
                  onChange={onChangeHandler}
                  required
                >
                  <option value={""}>Please Select</option>
                  {userRole.map((item) => (
                    <option value={item.role_id} key={item.role_id}>
                      {item.role_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Department */}
              <div className="flex flex-col gap-0">
                <label
                  htmlFor="department_id"
                  className="text-base font-medium text-black text-nowrap col-span-1"
                >
                  User Department{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  required
                >
                  <option value={""}>Please Select</option>
                  {userDept.map((item) => (
                    <option value={item.department_id} key={item.department_id}>
                      {item.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="h-[0.2px] w-full bg-gray-500 place-items-center" />
          <div className="grid -mt-3">
            <div className="flex-1 px-3">
              {/* <p className="text-lg underline underline-offset-8">
                User details & permissons
              </p> */}
            </div>
            <div className="flex-1 max-sm:flex-col px-4 py-1 gap-2 -mt-2">
              {/* <div className="grid grid-cols-2 gap-3"></div> */}

              {/* User Associated Sites */}
              <div className="flex flex-col gap-2 mt-3">
                <label
                  htmlFor="associated_sites"
                  className="text-base font-medium text-black text-nowrap col-span-1 underline underline-offset-4"
                >
                  User Associated Site/Sites{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="flex flex-wrap gap-3 w-full">
                  {userSite.map((item) => (
                    <div key={item.site_id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="associated_sites"
                        value={item.site_id}
                        id={`site-${item.site_id}`}
                        // Check if the site_id exists in the associated_sites array
                        //checked={formData.associated_sites.includes(item.site_name)}
                        onChange={onChangeHandler} // Handle changes correctly
                        className="mr-2"
                      />
                      <label
                        htmlFor={`site-${item.site_id}`}
                        className="text-black text-base"
                      >
                        {item.site_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* User Permissions */}
              <div className="underline underline-offset-4 text-base block w-full mt-2 font-medium">
                User Permissions
              </div>
              <div className="flex max-xl:flex-wrap w-[65vw] pb-2 mt-1">
                <div className="flex items-center gap-2 mr-2">
                  <label
                    htmlFor="can_raise_new_ticket"
                    className="text-base font-normal text-black text-nowrap"
                  >
                    (i) Can Raise Tickets:
                  </label>
                  <div
                    className={`${
                      raiseTicket ? "bg-green-500" : "bg-red-500"
                    } h-[20px] w-[40px] rounded-full flex items-center ${
                      !raiseTicket ? "justify-start" : "justify-end"
                    } cursor-pointer`}
                  >
                    <div
                      className={`bg-white h-[15px] w-[15px] rounded-full ${
                        !raiseTicket ? "ml-[3px]" : "mr-[3px]"
                      } relative my-auto`}
                    >
                      <button
                        onClick={handleRaiseTicket} // Handle toggle state change on div click
                        type="button"
                        name="can_raise_new_ticket"
                        value={raiseTicket}
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      ></button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <label
                    htmlFor="can_track_site_tickets"
                    className="text-base font-normal text-black text-nowrap col-span-1"
                  >
                    (ii) Can Track Site Generated Tickets:
                  </label>
                  <div
                    className={`${
                      trackSiteTicket ? "bg-green-500" : "bg-red-500"
                    } h-[20px] w-[40px] rounded-full flex items-center ${
                      !trackSiteTicket ? "justify-start" : "justify-end"
                    } cursor-pointer`}
                  >
                    <div
                      className={`bg-white h-[15px] w-[15px] rounded-full ${
                        !trackSiteTicket ? "ml-[3px]" : "mr-[3px]"
                      } relative my-auto`}
                    >
                      <button
                        onClick={handleTrackSiteTicket} // Handle toggle state change on div click
                        type="button"
                        name="can_track_site_tickets"
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      ></button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <label
                    htmlFor="can_track_department_tickets"
                    className="text-base font-normal text-black text-nowrap"
                  >
                    (iii) Can Track Departmental Tickets:
                  </label>
                  <div
                    className={`${
                      trackDeptTicket ? "bg-green-500" : "bg-red-500"
                    } h-[20px] w-[40px] rounded-full flex items-center ${
                      !trackDeptTicket ? "justify-start" : "justify-end"
                    } cursor-pointer`}
                  >
                    <div
                      className={`bg-white h-[15px] w-[15px] rounded-full ${
                        !trackDeptTicket ? "ml-[3px]" : "mr-[3px]"
                      } relative my-auto`}
                    >
                      <button
                        onClick={handleTrackDeptTicket} // Handle toggle state change on div click
                        type="button"
                        name="can_track_department_tickets"
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Reset buttons */}
          <div className="flex justify-start p-4 py-1">
            {/* <div>
              <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md"
                onClick={handleReset}
                type="reset"
              >
                Reset
              </button>
            </div> */}
            <div className="my-2">
              <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md"
                type="submit"
              >
                Create
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/allusers")}
              >
                Back
              </button> */}
              <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md ml-2"
                onClick={handleReset}
                type="reset"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
