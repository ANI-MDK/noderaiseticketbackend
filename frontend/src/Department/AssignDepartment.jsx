import { useEffect, useState } from "react";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "../Tickets/style.css";

const AssignDepartment = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { row } = location.state || {};
  // console.log(row);

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Departments", href: "/alldepartments" },
    { label: "Assign Department", active: true },
  ];

  const [formData, setFormData] = useState({
    assigner_id: row.current_assigner_id,
  });

  const onChangeHandler = (e) => {
    setFormData(e.target.value);
    // const { name, value } = e.target;
    // setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiUrl}/user/getalluser/${row.department_id}`;
      const token = localStorage.getItem("token");
      // console.log(token);
      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setUserList(res.data.data);
        } else {
          // console.log(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchData();
  }, []);

  const assignDept = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // console.log(row.department_id);
    const url = `${apiUrl}/department/updateassigner/${row.department_id}`;
    const token = localStorage.getItem("token");
    // console.log(token);

    try {
      const res = await axios.put(
        url,
        { assigner_id: formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);

      if (res.data.status === "success") {
        toast.success(res.data.message, {
          icon: true,
          position: "top-right",
          hideProgressBar: true,
        });
        setTimeout(() => {
          navigate("/alldepartments");
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
          onClick={() => navigate("/alldepartments")}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[98.5%] bg-[#342056] border-[1px] border-black flex-col justify-start items-center">
        <form
          className="h-auto w-full flex flex-col bg-gray-100 filter-[5px]"
          onSubmit={assignDept}
        >
          <div className="flex flex-col items-start">
            <div className="bg-[#257180] top-0 py-1 w-full text-[#F8E1B7]">
              <span className="ml-6">Add Assignee Details</span>
            </div>
            {/* <div className="flex-1 px-3 mt-3">
              <p className="text-2xl underline underline-offset-8 ml-2">
                Assignee details
              </p>
            </div> */}

            <div className="w-[55%] flex flex-col gap-2 px-4 relative py-2">
              <label
                htmlFor="assignee_name"
                className="text-lg font-medium text-black text-nowrap"
              >
                Assign In-Charge ({row.department_name}){" "}
                <span className="text-red-600 font-bold">*</span>
              </label>
              <select
                name="assigner_id"
                value={formData.current_assigner_id}
                className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                onChange={onChangeHandler}
                required
              >
                <option value="">Please Select an Option</option>
                {/* Map through userList to display all available users */}
                {userList.map((item) => (
                  <option value={item.user_id} key={item.user_id}>
                    {item.user_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-start p-4 py-1">
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
                onClick={() => navigate("/alldepartments")}
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

export default AssignDepartment;
