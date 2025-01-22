import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Tickets/style.css";

const EditUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { row } = location.state || {};
  // console.log(row);
  // console.log(row.can_track_department_tickets);

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Users", href: "/allusers" },
    { label: "Edit User", active: true },
  ];

  // Initialize selectedOptions based on row values
  const [selectedOptions, setSelectedOptions] = useState(
    row.user_site_ids.split(", ")
  );
  // console.log(selectedOptions);

  // Permission Toggle handling state
  const [raiseTicket, setRaiseTicket] = useState(
    row.user_can_raise_new_ticket == 1 ? true : false
  );
  const handleRaiseTicket = () => {
    setRaiseTicket((prev) => !prev);
    // console.log(raiseTicket);
  };

  const [trackSiteTicket, setTrackSiteTicket] = useState(
    row.user_can_track_site_tickets == 1 ? true : false
  );
  const handleTrackSiteTicket = () => {
    setTrackSiteTicket((prev) => !prev);
    // console.log(trackSiteTicket);
  };

  const [trackDeptTicket, setTrackDeptTicket] = useState(
    row.user_can_track_department_tickets == 1 ? true : false
  );
  const handleTrackDeptTicket = () => {
    setTrackDeptTicket((prev) => !prev);
    // console.log(trackDeptTicket);
  };

  // Initialize form data
  const [formData, setFormData] = useState({
    user_name: row.user_name,
    user_email: row.user_email,
    // user_is_active: row.is_active,
    old_department_id: row.user_department_id,
    department_id: row.user_department_id,
    role_id: row.user_role_id,
    associated_sites: row.user_site_ids,
    can_raise_new_ticket: raiseTicket ? 1 : 0,
    can_track_site_tickets: trackSiteTicket ? 1 : 0,
    can_track_department_tickets: trackDeptTicket ? 1 : 0,
  });

  // console.log(formData.can_raise_new_ticket, formData.can_track_site_tickets, formData.can_track_department_tickets);

  const [userSite, setUserSite] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [userDept, setUserDept] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // Fetch sites
      const siteRes = await axios.get(`${apiUrl}/site/getsitelist/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (siteRes.data.status === "success") {
        setUserSite(siteRes.data.data);
      }

      // Fetch roles
      const roleRes = await axios.get(`${apiUrl}/role/getrolelist/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (roleRes.data.status === "success") {
        setUserRole(roleRes.data.data);
      }

      // Fetch departments
      const deptRes = await axios.get(
        `${apiUrl}/department/getdepartmentlist/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (deptRes.data.status === "success") {
        setUserDept(deptRes.data.data);
      }
    };

    fetchData();
  }, []);

  const onChangeHandler = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => {
      if (name === "associated_sites") {
        const updatedSites = checked
          ? [...prev.associated_sites, value]
          : prev.associated_sites.filter((siteId) => siteId !== value);

        return { ...prev, associated_sites: updatedSites };
      } else if (type === "checkbox") {
        // Convert the boolean toggle to 1 or 0
        const newValue = checked ? 1 : 0;
        return { ...prev, [name]: newValue }; // Store 1 or 0 for the toggles
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const optionHandler = (e) => {
    const { value, checked } = e.target;

    setSelectedOptions((prev) => {
      // Ensure prev is an array before using .filter()
      const updatedOptions = Array.isArray(prev) ? prev : [];
      if (checked) {
        return [...updatedOptions, value];
      } else {
        return updatedOptions.filter((site) => site !== value);
      }
    });
  };

  const updateUser = async (e) => {
    // console.log(selectedOptions);
    // console.log(formData);
    // console.log(raiseTicket);
    // console.log(trackSiteTicket);
    // console.log(trackDeptTicket);

    // console.log({
    //   user_name: formData.user_name,
    //   user_email: formData.user_email,
    //   can_raise_new_ticket: raiseTicket,
    //   can_track_site_tickets: trackSiteTicket,
    //   can_track_department_tickets: trackDeptTicket,
    //   old_department_id: formData.old_department_id,
    //   department_id: formData.department_id,
    //   role_id: formData.role_id,
    //   associated_sites: selectedOptions,
    // });

    // console.log(formData.associated_sites);
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${apiUrl}/user/updateuser/${row.user_id}`,
        {
          user_name: formData.user_name,
          user_email: formData.user_email,
          can_raise_new_ticket: raiseTicket ? 1 : 0,
          can_track_site_tickets: trackSiteTicket ? 1 : 0,
          can_track_department_tickets: trackDeptTicket ? 1 : 0,
          old_department_id: formData.old_department_id,
          department_id: formData.department_id,
          role_id: formData.role_id,
          associated_sites: selectedOptions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.message, {
          icon: true,
          position: "top-right",
          hideProgressBar: true,
        });
        setTimeout(() => {
          navigate("/allusers");
        }, 6000);
      } else {
        // console.log(res.data);

        toast.error(res.data.message, {
          hideProgressBar: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user.", {
        hideProgressBar: true,
        position: "top-right",
      });
    }
  };

  // const handleDelete = async () => {
  //   // console.log(userList);
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete this item?"
  //   );
  //   if (isConfirmed) {
  //     const url = `${apiUrl}/user/deleteuser/${row.user_id}`;
  //     const token = localStorage.getItem("token");

  //     try {
  //       const res = await axios.get(url, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (res.data.status === "success") {
  //         toast.success(res.data.message, {
  //           hideProgressBar: true,
  //           position: "bottom-right",
  //         });
  //         setTimeout(() => {
  //           // window.location.reload();
  //           navigate("/allusers");
  //         }, 2500);
  //       } else {
  //         toast.error(res.data.message, {
  //           hideProgressBar: true,
  //           position: "bottom-right",
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     toast.info("Delete action canceled.", {
  //       hideProgressBar: true,
  //       position: "bottom-right",
  //     });
  //   }
  // };

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
        <form
          className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]"
          onSubmit={updateUser}
        >
          <div className="grid">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7]">
              <span className="ml-6">Edit User Details & Permissions</span>
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
                  Name <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  name="user_name"
                  value={formData.user_name}
                  required
                />
              </div>
              {/* User Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="user_email"
                  className="text-base font-medium text-black col-span-1"
                >
                  Email <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  name="user_email"
                  value={formData.user_email}
                  required
                />
              </div>
              {/* User Role */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="role_id"
                  className="text-base font-medium text-black col-span-1"
                >
                  Role <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  required
                >
                  <option value="">Please Select</option>
                  {userRole.map((item) => (
                    <option value={item.role_id} key={item.role_id}>
                      {item.role_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* User Department */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="department_id"
                  className="text-base font-medium text-black col-span-1"
                >
                  Department <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-rose-600 col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  required
                >
                  <option value="">Please Select</option>
                  {userDept.map((item) => (
                    <option value={item.department_id} key={item.department_id}>
                      {item.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <hr className="h-[1px] w-full bg-gray-500 place-items-center" />
          <div className="grid">
            {/* <div className="flex-1 px-3">
              <p className="text-2xl underline underline-offset-8">
                User settings & Permissions
              </p>
            </div> */}
            <div className="flex-1 max-sm:flex-col px-4 py-1 gap-3 -mt-4">
              {/* User Associated Sites */}
              <div className="flex flex-col gap-2 mt-3">
                <label
                  htmlFor="associated_sites"
                  className="text-base font-medium text-black col-span-1 underline underline-offset-4"
                >
                  Associated Site/Sites{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="col-span-2 flex gap-3 flex-wrap items-start justify-start">
                  {userSite.map((item) => (
                    <div
                      key={item.site_id}
                      className="flex items-center flex-wrap"
                    >
                      <input
                        type="checkbox"
                        name="associated_sites"
                        value={item.site_id}
                        defaultChecked={
                          selectedOptions.map(Number).includes(item.site_id)
                            ? true
                            : false
                        }
                        onChange={optionHandler}
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
              <div className="underline underline-offset-4 text-base block w-full mt-4 font-medium">
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
                    onClick={handleRaiseTicket} // Handle toggle state change on div click
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
                      <input
                        type="checkbox"
                        name="can_raise_new_ticket"
                        defaultValue={raiseTicket}
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      />
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
                    onClick={handleTrackSiteTicket} // Handle toggle state change on div click
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
                      <input
                        type="checkbox"
                        name="can_track_site_tickets"
                        defaultValue={trackSiteTicket}
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      />
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
                    onClick={handleTrackDeptTicket} // Handle toggle state change on div click
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
                      <input
                        type="checkbox"
                        name="can_track_department_tickets"
                        defaultValue={trackDeptTicket}
                        onChange={onChangeHandler}
                        className="absolute w-full h-full cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Submit and Reset buttons */}
          <div className="flex justify-between p-4 py-1">
            {/* <div>
              <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md"
                onClick={handleDelete}
                type="reset"
              >
                Delete user
              </button>
            </div> */}
            <div>
              <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md my-2"
                type="submit"
              >
                Update
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate(-1)}
              >
                Back
              </button> */}

              {/* <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md ml-2"
                onClick={handleDelete}
                type="reset"
              >
                Delete user
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
