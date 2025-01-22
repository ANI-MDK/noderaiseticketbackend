import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../BreadCrumb/BreadCrumb";

const MyTickets = () => {
  const navigate = useNavigate();
  const ticketPermission = localStorage.getItem("ticketPermission");
  const apiUrl = import.meta.env.VITE_API_URL;
  const isAdmin = localStorage.getItem("permission");

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tickets", href: "/mytickets", active: true },
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
  const statusOrder = { Open: 1, "In Progress": 2, Resolve: 3, Unsolve: 4, Close: 5 };


  const columns = [
    {
      name: "Ticket No.",
      selector: (row) => (
        <Link to="/mytickets/detail" state={row}>
          {row.ticket_number}
        </Link>
      ),
    },
    {
      name: "Title",
      selector: (row) => row.ticket_title,
      wrap: true,
    },
    {
      name: "Assigned To",
      selector: (row) => row.ticket_raise_to_dept_name +" Department",
    },
    {
      name: "Date & Time",
      sortable: true,
      selector: (row) => {
        const date = new Date(row.ticket_date).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        const time = new Date(row.ticket_date).toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${date}, ${time}`;
      },
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
        } else if (row.ticket_status === "Unsolve") {
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


  const [ticketList, setTicketList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchTicketList = async () => {

      let endPoint = "";
      if(isAdmin == 1){
        endPoint = '/ticket/getallticketlist';
      }
      else {
        endPoint = '/ticket/getraisedticketlist';
      }
      const url = `${apiUrl}${endPoint}`;

      // console.log(url);
      
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success" && response.data.data) {
          // console.log(response.data.data);
          setTicketList(response.data.data);
          setFilteredTickets(response.data.data);
        } else {
          toast.error(response.data.message, {hideProgressBar: true});
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTicketList();
  }, [apiUrl, isAdmin]);



  useEffect(() => {
    const filtered = ticketList.filter((ticket) => {
      return (
        ticket.ticket_number
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ticket.ticket_priority
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          ticket.ticket_status
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    });
    setFilteredTickets(filtered);
  }, [searchQuery, ticketList]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <div className="absolute w-full h-full flex flex-col items-start">
      <div className="md:mt-10 lg:mt-5 xl:mt-3 2xl:-mt-1">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex-1 relative w-[98.45%]">
        <div className="h-auto bg-white border-[1px] border-black">
          <DataTable
            title="My Tickets"
            data={filteredTickets}
            columns={columns}
            customStyles={tableCustomStyles}
            striped
            highlightOnHover
            dense
            className="rounded-lg w-full"
            actions={
              <>
                {ticketPermission === "1" && (
                  <button
                    type="button"
                    onClick={() => navigate("/mytickets/create")}
                    className="absolute lg:right-[38%] xl:right-[32%] 2xl:right-[21.5%] bg-[#257180] text-white px-4 py-1 rounded-md font-medium cursor-pointer z-20 text-base"
                  >
                    New Ticket <span className="text-lg text-white">+</span>
                  </button>
                )}
                <CiSearch
                  className="absolute mr-1 z-10 cursor-pointer lg:right-[32.5%] xl:right-[27.5%] 2xl:right-[18.3%]"
                  size={25}
                />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="absolute bg-gray-200 rounded-md text-lg px-[2rem] py-1 outline-none lg:w-[35%] xl:w-[30%] 2xl:w-[20%] border-[1.8px] border-black"
                  onChange={handleSearch}
                  value={searchQuery}
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
