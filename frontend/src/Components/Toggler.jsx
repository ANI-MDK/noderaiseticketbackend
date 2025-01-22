import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const Toggler = ({ active, user_id, fetchData, raise_ticket, track_site_tickets, track_department_tickets }) => {
  const [toggled, setToggled] = useState(active);

  const setToggle = () => {
    setToggled((prev) => !prev);

    if (user_id) {
      handleUserStatus(user_id);
    } else {
      return;
    }
     
  };

  const handleUserStatus = async (user_id) => {
    const url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${url}/user/updateuserstatus/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res);

      if (res.data.status === "success") {
        fetchData();
        toast.success(res.data.message, {
          icon: true,
          position: "bottom-right",
          style: {
            backgroundColor: "#c1e8da",
            color: "#3c6e57",
            fontWeight: "600",
            textAlign: "center",
            width: "100%",
          },
          hideProgressBar: true,
        });
      } else {
        toast.error(res.data.message, {
          hideProgressBar: true,
          position: "bottom-right",
        });
        // console.log(res.data.message);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div
      onClick={setToggle} // Handle toggle state change on div click
      className={`${
        toggled ? "bg-green-500" : "bg-red-500"
      } h-[20px] w-[40px] rounded-full flex items-center ${
        !toggled ? "justify-start" : "justify-end"
      } cursor-pointer`}
    >
      <div
        className={`bg-white h-[15px] w-[15px] rounded-full ${
          !toggled ? "ml-[3px]" : "mr-[3px]"
        } relative my-auto`}
      >
        {/* No need for an input element, div click handles the toggle */}
      </div>
    </div>
  );
};

export default Toggler;
