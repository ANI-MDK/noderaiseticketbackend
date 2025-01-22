import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import "../User/style.css";
//import { FaEye } from "react-icons/fa";

const AssignedTickets = () => {
  const navigate = useNavigate();
  const ticketPermission = localStorage.getItem("ticketPermission");
  //console.log(ticketPermission);
  const apiUrl = import.meta.env.VITE_API_URL;

  const breadItems = [
    { label: "Home", href: "#" },
    // { label: "Raise Ticket", href: "#" },
    { label: "Assigned Tickets", active: true },
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

  //const [searchQuery, setSearchQuery] = useState("");

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  const statusOrder = { Open: 1, "In Progress": 2, Resolve: 3, Unsolved: 4, Close: 5 };

  const columns = [
    // { name: "# Sl_No.", selector: (rows, index) => index + 1, sortable: true },
    {
      name: "Ticket No",
      selector: (rows) => (
        <Link to="/assignedtickets/detail" state={rows}>
          {rows.ticket_number}
        </Link>
      ),
    },
    {
      name: "Title",
      selector: (rows) => rows.ticket_title,
      wrap: true,
    },
    {
      name: "Assigned To",
      selector: (rows) => rows.ticket_raise_to_dept_name+" Department",
    },
    {
      name: "Date & Time",
      selector: (rows) => {
        return new Date(rows.ticket_date).toLocaleString("en-IN", {
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
      selector: (rows) =>
        rows.ticket_priority === "High" ? (
          <span className="text-red-600 font-medium">
            {rows.ticket_priority}
          </span>
        ) : rows.ticket_priority === "Medium" ? (
          <span className="text-yellow-500 font-medium">
            {rows.ticket_priority}
          </span>
        ) : (
          <span className="text-green-600 font-medium">
            {rows.ticket_priority}
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
      selector: (rows) => {
        // Using if-else condition inside the selector
        if (rows.ticket_status === "Open") {
            return <span className="text-green-600 font-medium">Open</span>;
        } else if (rows.ticket_status === "In Progress") {
            return (<span className="text-yellow-500 font-medium">In-progress</span>);
        } else if (rows.ticket_status === "Resolve") {
            return <span className="text-blue-500 font-medium">Resolve</span>;
        } else if (rows.ticket_status === "Unsolve") {
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


  const [assignedticketList, setAssignedTicketList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch]=useState('');
  
  const url = `${apiUrl}/ticket/getassignedticketlist`;
  const token = localStorage.getItem("token");
  const fetchTicketList = async () => {
    try {
      const allTicketRes = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (allTicketRes.data.status === "success" && allTicketRes.data.data) {
        // console.log(allTicketRes.data.data);
        setAssignedTicketList(allTicketRes.data.data);
        setFilteredTickets(allTicketRes.data.data);
      } else {
        toast.error(allTicketRes.data.messagee);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  

  useEffect(() => {
    fetchTicketList();
  }, []);

  useEffect(()=>{
    const result=assignedticketList.filter((item)=>{
        if(item.ticket_number.toLowerCase().match(search.toLocaleLowerCase())) {
            return item.ticket_number
        }
        else if(item.ticket_priority.toLowerCase().match(search.toLocaleLowerCase())) {
            return item.ticket_priority
        }
        else if((item.ticket_status).toLowerCase().match(search.toLocaleLowerCase())) {
            return item.ticket_status
        }
        else if((item.ticket_raise_to_dept_name+" Department").toLowerCase().match(search.toLocaleLowerCase())) {
          return (item.ticket_raise_to_dept_name+" Department")
      }
        return null
    });
    setFilteredTickets(result);
  },[search]);



  return (
    <div className="absolute w-full h-full flex flex-col items-start">
      <div className="md:mt-10 lg:mt-5 xl:mt-3 2xl:-mt-1">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex-1 relative w-[98.45%]">
        <div className="h-auto bg-white border-[1px] border-black">
          <DataTable
            title="Assigned Tickets"
            data={filteredTickets}
            columns={columns}
            customStyles={tableCustomStyles}
            striped
            highlightOnHover
            dense
            className="rounded-lg w-full"
            actions={
              <>
                <CiSearch
                  className="absolute mr-1 z-10 cursor-pointer lg:right-[31.5%] xl:right-[27.5%] 2xl:right-[18.3%]"
                  size={25}
                />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="absolute bg-gray-200 rounded-md text-lg px-[2rem] py-1 outline-none lg:w-[35%] xl:w-[30%] 2xl:w-[20%] border-[1.8px] border-black"
                  value={search} 
                  onChange={(e)=>setSearch(e.target.value)}
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AssignedTickets;
