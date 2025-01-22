import { useEffect, useState } from "react";
import { Sidebar, total, openTicket, inProgress, resolved } from "../Index.js";
import "../Tickets/style.css"; // Make sure this file exists
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboard/getallticketcount`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status === "success") {
          // console.log(res.data.data);
          setTicketData(res.data.data);
        } else {
          // console.log(res);
          toast.error(res.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* <Sidebar /> */}

      <section className="flex items-center justify-center gap-16">
        {/* Total Ticket in System Card */}
        <div className="flex flex-col items-start justify-start h-[80%] w-full sm:w-60 xl:w-72 bg-[#2acacd] text-left p-4 rounded-lg cursor-pointer">
          <div className="h-full w-full p-2 flex flex-wrap justify-start items-center gap-3">
            <img src={total} alt="Total Tickets" style={{ height: "50px" }} />
            <span className="text-2xl mt-4 font-bold">
              {ticketData.map((item) => item.total_tickets)}
            </span>
          </div>
          <p className="text-[#640D5F] text-nowrap text-sm xl:text-lg font-semibold">
            Total Tickets Generated
          </p>
        </div>

        {/* Total Ticket in Open Card */}
        <div className="flex flex-col items-start justify-start h-[80%] w-full sm:w-60 xl:w-72 bg-[#9EDF9C] text-center p-4 rounded-lg cursor-pointer">
          <div className="h-full w-full p-2 flex flex-wrap justify-start items-center gap-3">
            <img
              src={openTicket}
              alt="Open Tickets"
              style={{ height: "50px" }}
            />
            <span className="text-3xl mt-4 font-bold">
              {ticketData.map((item) => item.total_open_tickets === null ? "0" : item.total_open_tickets )}
            </span>
          </div>
          <p className="text-[#640D5F] text-nowrap text-sm xl:text-lg font-semibold">
            Total Open Tickets
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center gap-16 my-4">
        {/* Total Ticket in Progress Card */}
        <div className="flex flex-col items-start justify-start h-[80%] w-full sm:w-60 xl:w-72 bg-[#FFE31A] text-center p-4 rounded-lg cursor-pointer">
          <div className="h-full w-full p-2 flex flex-wrap justify-start items-center gap-3">
            <img
              src={inProgress}
              alt="Tickets in Progress"
              style={{ height: "50px" }}
            />
            <span className="text-3xl mt-4 font-bold">{ticketData.map((item) => item.total_in_progress_tickets === null ? "0" : item.total_in_progress_tickets)}</span>
          </div>
          <p className="text-[#640D5F] text-nowrap text-sm xl:text-lg font-semibold">
            Total In-Progress Tickets
          </p>
        </div>

        {/* Total Ticket Resolved Card */}
        <div className="flex flex-col items-start justify-start h-[80%] w-full sm:w-60 xl:w-72 bg-[#FA4032] text-center p-4 rounded-lg cursor-pointer">
          <div className="h-full w-full p-2 flex flex-wrap justify-start items-center gap-3">
            <img
              src={resolved}
              alt="Resolved Tickets"
              style={{ height: "50px" }}
            />
            <span className="text-3xl mt-4 font-bold">{ticketData.map((item) => item.total_close_tickets === null? "0" : item.total_close_tickets)}</span>
          </div>
          <p className="text-[#640D5F] text-nowrap text-sm xl:text-lg font-semibold">
            Total Closed Tickets
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
