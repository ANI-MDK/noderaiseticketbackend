import { CiSearch } from "react-icons/ci";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Sidebar from "../Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import "../Tickets/style.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const AllTickets = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tickets", href: "/mytickets" },
    { label: "Tickets List", active: true },
  ];

  const ticketPermission = localStorage.getItem("ticketPermission");
  // console.log(ticketPermission);

  // Sample tickets data
  const tickets = [
    {
      ticketId: "TICKET001",
      department: "IT Support",
      title: "Laptop Freezing",
      assignee: "Devon Larrat",
      date: "11/11/2024",
      time: "06:35 PM",
      description:
        "Laptop is not working, failed to reboot, immediately needed to get fixed.",
      status: "Resolved",
      priority: "High",
    },
    {
      ticketId: "TICKET002",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET003",
      department: "IT Support",
      title: "Keyboard Malfunctioning",
      assignee: "John Smith",
      date: "13/11/2024",
      time: "03:15 PM",
      description: "Certain keys on the laptop are not responding.",
      status: "Won't fixed",
      priority: "Low",
    },
    {
      ticketId: "TICKET004",
      department: "IT Support",
      title: "Keyboard Malfunctioning",
      assignee: "John Smith",
      date: "13/11/2024",
      time: "03:15 PM",
      description: "Certain keys on the laptop are not responding.",
      status: "Resolved",
      priority: "High",
    },
    {
      ticketId: "TICKET005",
      department: "IT Support",
      title: "Keyboard Malfunctioning",
      assignee: "John Smith",
      date: "13/11/2024",
      time: "03:15 PM",
      description: "Certain keys on the laptop are not responding.",
      status: "In Progress",
      priority: "Low",
    },
    {
      ticketId: "TICKET006",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET007",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET008",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET009",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET010",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET011",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET012",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET013",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    {
      ticketId: "TICKET014",
      department: "HR",
      title: "Laptop Screen Flickering",
      assignee: "Jane Doe",
      date: "12/11/2024",
      time: "09:00 AM",
      description: "Screen flickering intermittently, needs urgent attention.",
      status: "In Progress",
      priority: "Medium",
    },
    // Add more tickets as needed
  ];

  const [ticketList, setTicketList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priority, setPriority] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");

  // Search filter handler
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Priority filter handler
  const prioritySearch = (e) => {
    // console.log(e.target.value);

    setPriority(e.target.value);
  };

  // Status filter handler
  const ticketStatusSearch = (e) => {
    // console.log(e.target.value);
    setTicketStatus(e.target.value);
  };

  const [filteredTickets, setFilteredTickets] = useState(ticketList);
  // const filteredTicketsVal = filteredTickets.filter((ticket) => {
  //   const matchedSearch =
  //     ticket.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchedPriority = ticket.priority === priority || priority === "";
  //   const matchedStatus = ticket.status === ticketStatus || ticketStatus === "";

  //   // console.log(matchedSearch, matchedPriority, matchedStatus);

  //   return matchedSearch && matchedPriority && matchedStatus;
  // });

  // Update filtered tickets when searchQuery or priority changes
  useEffect(() => {
    // console.log(ticketList);
    // setFilteredTickets(filteredTicketsVal);
  }, []);

  // Fetching Ticket details
  useEffect(() => {
    const url = `${apiUrl}/ticket/getraisedticketlist`; // API will be here
    const token = localStorage.getItem("token");

    async function fetchTicketList() {
      try {
        const allTicketRes = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (allTicketRes.data.status === "success" && allTicketRes.data.data) {
          // console.log(allTicketRes.data.data);
          setTicketList(allTicketRes.data.data);
          setFilteredTickets(allTicketRes.data.data);
        } else {
          toast.error(allTicketRes.data.messagee);
        }
      } catch (error) {
        // console.log(error);
      }
    }

    fetchTicketList();
  }, []);

  return (
    <div className="main h-auto lg:max-h-[74.5vh] xl:min-h-[76vh] 2xl:min-h-[82vh] mt-10">
      <Sidebar />
      <div className="relative mb-1">
        <BreadCrumb items={breadItems} />
        {ticketPermission == 1 && (
          <button
            className="bg-[#342056] text-white font-normal px-4 py-1 rounded-md absolute lg:right-4 xl:right-3 2xl:right-12 top-0"
            type="button"
            onClick={() => navigate("/addTicket")}
          >
            Raise Ticket
          </button>
        )}
      </div>
      <div className="h-auto w-[80%] bg-white border-[1px] border-black lg:w-[70vw] xl:w-[75vw] 2xl:w-[80vw] max-w-full flex-col justify-start items-center">
        <div className="h-auto w-full bg-[#342056] p-2 pt-2 pb-2 rounded-t-sm flex items-center gap-3 relative">
          <input
            className="py-1 pl-10 lg:pl-10 w-[60%] lg:w-[30%] border-[1px] border-black rounded-sm outline-none"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <CiSearch className="absolute left-2" size={35} />
          <label className="text-xl text-white font-light">Priority</label>
          <select
            value={priority}
            onChange={prioritySearch}
            className="border-[1px] border-black w-1/4 md:w-[15%] py-1 max-w-full"
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <label className="text-xl text-white font-light">Status</label>
          <select
            value={ticketStatus}
            onChange={ticketStatusSearch}
            className="border-[1px] border-black w-1/4 md:w-[15%] py-1 max-w-full"
          >
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="grid grid-cols-8 p-4 gap-1 overflow-x-hidden">
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Sl. No.
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Ticket No.
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Ticket Title
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Assign To (Dept)
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Posted On
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Priority
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Status
          </h4>
          <h4 className="font-medium text-sm border-b-[1px] border-slate-300">
            Action
          </h4>

          {/* Mapping through tickets data */}
          {filteredTickets.map((ticket, index) => (
            <React.Fragment key={index}>
              {/* Sl No */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p className="font-medium text-sm">{index + 1}</p>
              </div>
              <div className="border-b-[1px] mt-2 border-slate-300 text-wrap">
                <p className="font-medium text-sm">{ticket.ticket_number}</p>
              </div>
              {/* ticketId */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p className="font-medium text-sm">{ticket.ticket_title}</p>
              </div>
              {/* department */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p className="font-medium text-sm">
                  {ticket.ticket_raise_to_dept_name}
                </p>
              </div>
              {/* title */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p className="font-medium text-sm">
                  {new Date(ticket.ticket_date).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>
              {/* priority */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p
                  className={`font-medium ${
                    ticket.ticket_priority === "High"
                      ? "text-red-600"
                      : ticket.ticket_priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {ticket.ticket_priority}
                </p>
              </div>
              {/* status */}
              <div className="border-b-[1px] mt-2 border-slate-300">
                <p
                  className={`text-nowrap font-medium ${
                    ticket.ticket_status === "Open"
                      ? "text-green-600"
                      : ticket.ticket_status === "In Progress"
                      ? "text-yellow-500"
                      : "text-red-600"
                  }`}
                >
                  {ticket.ticket_status}
                </p>
              </div>
              {/* View */}
              <div className="border-b-[1px] border-slate-300 flex items-center gap-2">
                {/* <FaEye
                  className="cursor-pointer"
                  onClick={() =>
                    navigate("/ticket-detail", { state: { ticket } })
                  }
                /> */}
                <button
                  className="text-blue-500 font-medium cursor-pointer justify-center"
                  onClick={() =>
                    navigate("/ticket-detail", { state: { ticket } })
                  }
                >
                  <FaEye className="ml-2" size={20} />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
