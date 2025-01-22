import { useState } from "react";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "../Tickets/style.css";

const AddRole = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Roles", href: "/allroles" },
    { label: "Add Role", active: true },
  ];
  const [formData, setFormData] = useState({
    role_name: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createRole = async (e) => {
    e.preventDefault();
    const url = `${apiUrl}/role/createrole`;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        url,
        {
          role_name: formData.role_name,
        },
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
          navigate("/allroles");
        }, 6000);
      } else {
        toast.error(res.data.message, {
          hideProgressBar: true,
          position: "top-right",
        });
      }
    } catch (error) {
      // console.log(error);
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
          onClick={() => navigate("/allroles")}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center">
        <form
          onSubmit={createRole}
          className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]"
        >
          <div className="flex flex-col items-start">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7] text-base"><span className="ml-6">Add Role Details</span></div>
            {/* <div className="flex-1 px-3 mt-3">
              <p className="text-2xl underline underline-offset-8 ml-2">
                Role details
              </p>
            </div> */}
            <div className="w-[55%] flex flex-col gap-2 px-4 relative py-2">
              <label
                htmlFor="role_name"
                className="text-lg font-medium text-black text-nowrap"
              >
               Role Name <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter role name here"
                className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] rounded-md"
                onChange={onChangeHandler}
                name="role_name"
                value={formData.role_name}
                required
              />
            </div>
          </div>
          <div className="flex justify-start p-4 py-1">
            <div className="w-[55%]">
              <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mb-2"
                type="submit"
              >
                Create
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/allroles")}
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

export default AddRole;
