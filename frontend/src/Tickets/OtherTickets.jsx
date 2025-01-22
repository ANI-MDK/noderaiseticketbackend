import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import "../User/style.css";
//import { FaEye } from "react-icons/fa";

const OtherTickets = () => {
  const navigate = useNavigate();
  const ticketPermission = localStorage.getItem("ticketPermission");
  //console.log(ticketPermission);
  const apiUrl = import.meta.env.VITE_API_URL;

  const breadItems = [
    { label: "Home", href: "#" },
    { label: "Other Tickets", active: true },
  ];

  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "normal",
        backgroundColor: "#257180",
        justifyContent: "start",
        alignItems: "center",
        color: "#F8E1B7",
      },
    },
    cells: {
      style: {
        fontSize: "14px", // Font size for the text in the cells
        display: "flex", // Enable flex layout
        justifyContent: "start", // Align content to the start horizontally
        alignItems: "center", // Vertically align content to the center
        flexWrap: "wrap", // Allow content to wrap if needed
        overflow: "visible", // Ensure content is not clipped or truncated
        whiteSpace: "normal", // Allow text to wrap and prevent ellipsis
        textOverflow: "clip", // Prevent ellipsis in case of overflow
        width: "10px",
      },
    },
  };

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  const statusOrder = { Open: 1, "In Progress": 2, Resolve: 3, Unsolved: 4, Close: 5 };

  const columns = [
    // { name: "# Sl_No.", selector: (rows, index) => index + 1, sortable: true },
    {
      name: "Ticket No",
      selector: (row) => (
        <Link to="/othertickets/otherticketsdetail" state={row}>
          {row.ticket_number}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Title / Issue",
      selector: (row) => row.ticket_title,
      wrap: true,
    },
    {
      name: "Assigned To",
      selector: (row) => row.ticket_raise_to_dept_name + " Department",
    },
    {
      name: "Date & Time",
      selector: (row) => {
        return new Date(row.ticket_date).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) =>
        row.ticket_priority === "High" ? (
          <span className="text-red-600 font-medium">
            {row.ticket_priority}
          </span>
        ) : row.ticket_priority === "Medium" ? (
          <span className="text-yellow-500 font-medium">
            {row.ticket_priority}
          </span>
        ) : (
          <span className="text-green-600 font-medium">
            {row.ticket_priority}
          </span>
        ),
      sortable: true,
      sortFunction: (rowA, rowB) => {
        return (
          priorityOrder[rowA.ticket_priority] -
          priorityOrder[rowB.ticket_priority]
        );
      },
    },
    {
      name: "Current Status",
      selector: (row) => {
        // Using if-else condition inside the selector
        if (row.ticket_status === "Open") {
            return <span className="text-green-600 font-medium">Open</span>;
        } else if (row.ticket_status === "In Progress") {
            return (<span className="text-yellow-500 font-medium">In-progress</span>);
        } else if (row.ticket_status === "Resolve") {
            return <span className="text-blue-500 font-medium">Resolve</span>;
        } else if (row.ticket_status === "Unsolved") {
            return <span className="text-gray-500 font-medium">Unsolved</span>;
        } else {
            return <span className="text-red-500">Closed</span>;
        }
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        return (statusOrder[rowA.ticket_status] - statusOrder[rowB.ticket_status]);
      },
    },
  ];

  const [otherticketsList, setOtherticketsList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState(otherticketsList);

  const url = `${apiUrl}/ticket/getdepartmentotherticketlist`;
  const token = localStorage.getItem("token");
  const fetchOtherTicketList = async () => {
    try {
      const allTicketRes = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (allTicketRes.data.status === "success" && allTicketRes.data.data) {
        // console.log(allTicketRes.data.data);
        setOtherticketsList(allTicketRes.data.data);
        setFilteredTickets(allTicketRes.data.data);
      } else {
        toast.error(allTicketRes.data.message);
      }
    } catch (error) {
      toast.error(error);
      //console.log(error);
    }
  };

  useEffect(() => {
    fetchOtherTicketList();
  }, []);

  // useEffect(() => {
  //   const filtered = ticketList.filter((ticket) => {
  //     return (
  //       ticket.ticket_number
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       ticket.ticket_raise_to_dept_name
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase())
  //     );
  //   });
  //   setFilteredTickets(filtered);
  // }, [searchQuery, ticketList]);

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  return (
    <div className="absolute w-full h-full flex flex-col items-start">
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-full relative">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex-1 relative w-[98.45%]">
        {/* <Sidebar /> */}
        <div className="h-auto bg-white border-[1px] border-black">
          {/* <button
            type="button"
            onClick={() => navigate("/addTicket")}
            className="absolute lg:-top-3 lg:right-[38%] xl:right-[28%] 2xl:right-[20.5%] bg-gray-300 px-4 py-[5px] rounded-md font-medium cursor-pointer z-20"
          >
            New Ticket <span className="text-lg">+</span>
          </button> */}
          {/* <input
            type="search"
            placeholder="Search here..."
            className="absolute lg:-mt-[13px] lg:-right-2 z-10 border-[1px] border-black bg-gray-200 rounded-md text-lg px-10 lg:py-1 xl:py-1 2xl:w-[20%] w-[250px]"
          />
          <CiSearch
            className="search-icon absolute z-10 lg:-top-2 cursor-pointer -mx-1 pt-1"
            size={24}
          /> */}
        </div>
        <div className="absolute top-0 left-0 h-auto w-full rounded-sm mb-3 bg-white border-[1px] border-black">
          <DataTable
            title="Departmental Tickets"
            data={filteredTickets}
            columns={columns}
            customStyles={tableCustomStyles}
            striped
            highlightOnHover
            dense
            className="rounded-lg w-full"
            actions={
              <>
                {/* {ticketPermission === "1" && (
                  <button
                    type="button"
                    onClick={() => navigate("/mytickets/create")}
                    className="absolute lg:right-[38%] xl:right-[32%] 2xl:right-[21.5%] bg-[#257180] text-white px-4 py-1 rounded-md font-medium cursor-pointer z-20 text-base"
                  >
                    New Ticket <span className="text-lg text-white">+</span>
                  </button>
                )} */}
                <CiSearch
                  className="absolute z-10 cursor-pointer lg:right-[32.5%] xl:right-[27.5%] 2xl:right-[18.3%]"
                  size={25}
                />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="absolute bg-gray-200 rounded-md text-lg px-[2rem] py-1 outline-none lg:w-[35%] xl:w-[30%] 2xl:w-[20%] border-[1.8px] border-black"
                  // onChange={handleSearch}
                  // value={searchQuery}
                />
              </>
            }
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtherTickets;
