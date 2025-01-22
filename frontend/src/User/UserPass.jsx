import { useState } from "react";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const UserPass = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { row } = location.state || {};
  // console.log(row);

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Users", href: "/allusers" },
    { label: "Change Password", active: true },
  ];

  const [formData, setFormData] = useState({
    password: "",
    cnfpassword: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const changePass = async (e) => {
    e.preventDefault();
    // console.log(formData);

    const url = `${apiUrl}/user/updateuserpassword/${row.user_id}`;
    const token = localStorage.getItem("token");

    if (
      !formData.cnfpassword ||
      formData.password === "" ||
      formData.cnfpassword === ""
    ) {
      return toast.info("Please Enter password");
    }

    if (formData.password === formData.cnfpassword) {
      try {
        const res = await axios.put(
          url,
          { user_password: formData.cnfpassword },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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
          toast.error(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    } else {
      toast.error("Password doesn't match !");
    }
  };

  return (
    <div className="absolute w-full h-full flex flex-col items-start">
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
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center">
        <form
          className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]"
          onSubmit={changePass}
        >
          <div className="grid">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7]"><span className="ml-6">Change password</span></div>
            {/* <div className="flex-1 px-3 mt-3">
              <p className="text-2xl underline underline-offset-8 ml-2">
                Change password
              </p>
            </div> */}
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2 px-4 relative py-2">
                <label
                  htmlFor="password"
                  className="text-lg font-medium text-black text-nowrap col-span-1"
                >
                  New Password:
                </label>
                <input
                  type="text"
                  placeholder="Enter a strong password"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  name="password"
                  value={formData.password}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 px-4 relative py-2">
                <label
                  htmlFor="cnfpassword"
                  className="text-lg font-medium text-black text-nowrap col-span-1"
                >
                  Confirm New Password:
                </label>
                <input
                  type="text"
                  placeholder="Re-enter password"
                  className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                  onChange={onChangeHandler}
                  name="cnfpassword"
                  value={formData.cnfpassword}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start p-4 py-1">
            <div>
              <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mb-2"
                type="submit"
              >
                Update
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/allusers")}
              >
                Back
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPass;
