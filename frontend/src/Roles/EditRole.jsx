import { useState } from "react";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "../Tickets/style.css";

const EditRole = () => {
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Roles", href: "/allroles" },
    { label: "Edit Role", active: true },
  ];
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { row } = location.state || {};
  const [formData, setFormData] = useState({
    role_name: row.role_name,
    is_active: row.is_active,
  });
  // console.log(row);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // console.log(formData.role_name);
  };

  const updateRole = async (e) => {
    e.preventDefault();
    const url = `${apiUrl}/role/updaterole/${row.role_id}`;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        url,
        { role_name: formData.role_name, role_is_active: formData.is_active },
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
          // style: {
          //   backgroundColor: "#c1e8da",
          //   color: "#3c6e57",
          //   fontWeight: "600",
          //   textAlign: "center",
          //   width: "100%",
          // },
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

  // const handleDelete = async () => {
  //   // console.log(roleList);
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete this item?"
  //   );
  //   if (isConfirmed) {
  //     const url = `${apiUrl}/role/deleterole/${row.role_id}`;
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
  //           icon: true,
  //           position: "top-right",
  //           hideProgressBar: true,
  //         });
  //         setTimeout(() => {
  //           // window.location.reload();
  //           navigate("/allroles");
  //         }, 6000);
  //       } else {
  //         toast.error(res.data.message, {
  //           hideProgressBar: true,
  //           position: "top-right",
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     toast.info("Delete action canceled.", {
  //       hideProgressBar: true,
  //       position: "top-right",
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
          onClick={() => navigate("/allroles")}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center">
        <form
          onSubmit={updateRole}
          className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]"
        >
          <div className="flex flex-col items-start">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7]">
              <span className="ml-6">Edit Role Details</span>
            </div>
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
                Role Name<span className="text-red-600 font-bold"> *</span>
              </label>
              <input
                type="text"
                className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] rounded-md"
                onChange={onChangeHandler}
                name="role_name"
                value={formData.role_name}
                required
              />
            </div>
          </div>

          <div className="flex justify-start p-4 py-1">
            {/* <div>
              <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md"
                type="button"
                onClick={handleDelete}
              >
                Delete role
              </button>
            </div> */}
            <div className="w-[55%]">
              <button
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mb-2"
                type="submit"
              >
                Update
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/allroles")}
              >
                Back
              </button> */}

              {/* <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md ml-2"
                type="button"
                onClick={handleDelete}
              >
                Delete role
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
