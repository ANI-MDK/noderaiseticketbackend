import BreadCrumb from "../BreadCrumb/BreadCrumb";
//import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import arrow from "../assets/arrows.png";
//import { MdOutlineAdd } from "react-icons/md";
//import { RiSubtractLine } from "react-icons/ri";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GiPaperClip } from "react-icons/gi";
//mport { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const SiteGeneratedTicketsDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state || {};
  //console.log(ticket);
  

  const breadItems = [
    { label: "Home" },
    { label: "Site Generated Tickets" },
    { label: "Site Generated Tickets Detail", active: true },
  ];

   const [data, setData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const ticketDetail = async () => {
    const res = await axios.get(
      `${apiUrl}/ticket/getticketdetailslist/${ticket.ticket_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(res);
    if (res.data.status === "success") {
      //console.log(res.data.data);
      setData(res.data.data);
    }
  };

  // ( UseEffect For Fetching Data )
  useEffect(() => {
    ticketDetail();
  }, []);



  return (
    <div className="absolute w-[98.5%]">
      {/* <Sidebar /> */}
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-full relative">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex w-full gap-2 2xl:gap-3 mt-6">
        {/* Ticket Details Section */}
        <div className="w-full lg:w-[60%] xl:w-[30%] lg:h-[50vh] 2xl:h-[40vh]  border-[1px] border-black py-2 px-4 rounded-md overflow-y-auto  bg-yellow-50">
          <h3 className="text-lg text-center font-semibold mb-4 underline underline-offset-8 -mt-2">Ticket Details</h3>
          <div className=" grid grid-cols-1 md:grid-cols-2">
            <div className="text-xs mb-1"><strong>Ticket No: </strong>{" "}<span className="text-blue-500 font-medium text-xs"><Link to="/sitegeneratedtickets">{ticket?.ticket_number}</Link></span></div>
            <div className="text-xs mb-1">
              <strong >Date & Time: </strong><span className="text-xs">{new Date(ticket?.ticket_date).toLocaleString("en-IN", {timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}</span>
            </div>
            <div className="text-xs mb-1"><strong>Priority:</strong>{" "}
              <span className={`${ticket?.ticket_priority === "Low" ? "text-green-600": ticket?.ticket_priority === "High" ? "text-red-600": "text-yellow-600"} font-medium`}>{ticket?.ticket_priority}</span>
            </div>
            <div className="text-xs mb-1">
              <strong>Current Status:</strong>{" "}<span>{ticket?.ticket_status}</span>
            </div>
            <div className="text-xs mb-1">
              <strong>Assigned By:</strong>{" "}<span>{ticket?.ticket_raise_by_name}</span>
            </div>
            <div className="text-xs mb-1">
              <strong>Assigned To:</strong>{" "}<span>{ticket?.ticket_raise_to_dept_name} Department</span>
            </div>
          </div>
          <hr></hr>
          <div>
            <p className="text-center mb-2 text-sm"><strong>Title:</strong>{" "}<span className="text-wrap whitespace-pre-line text-indigo-800">{ticket?.ticket_title}</span></p>
          </div>
          {/* <div className="lg:max-h-10 xl:max-h-40 overflow-y-auto p-2">
            <p className="text-center mb-6 -mt-2 text-sm">
                <strong>Title:</strong>{" "}<span className="text-wrap whitespace-pre-line text-indigo-800">{ticket?.ticket_title}</span>
            </p>
          </div> */}
          <div className="flex flex-col lg:mt-4">
              <button className="bg-[#000] text-white font-semibold px-2 py-1 rounded-md" type="button"onClick={() => navigate("/sitegeneratedtickets")}>Back</button>
          </div>
        </div>
        {/* Ticket Raiser & Resolver Chatbox */}
        <div className="w-full lg:h-[50vh] 2xl:h-[40vh] lg:w-[38%] xl:w-[70%] border-[1px] border-black py-2 px-4 rounded-md overflow-hidden bg-yellow-50">
          <h3 className="text-lg text-center font-semibold mb-4 underline underline-offset-8 -mt-2">Ticket Communication</h3>

          {/* Chatbox */}
          <div className="h-[80%] w-full overflow-y-auto mb-4 space-y-1 rounded-md">
            {data.length !== null &&
              data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {idx > 0 && (
                    <div className="flex justify-center items-center">
                      <div className="bg-transparent">
                        <img className="rotate-90 h-[2rem]" src={arrow} alt="arrow"/>
                      </div>
                    </div>
                  )}
                  <div className={`flex justify-center w-full ${item.action_by_user_name === localStorage.getItem("user_name") ? "bg-[#69afec3b]" : "bg-[#d1f7d3]"}`}>
                    <div className="p-1 rounded-lg shadow-sm w-full max-w-full">
                      <div className="flex justify-between px-1">
                        <strong className="text-left text-red-500 text-xs font-serif">{(item.action_by_user_name)}  <span className="text-orange-700 font-mono">{item.action_by_department_name ===null ? "" : "("+ item.action_by_department_name +")"}</span></strong>
                        {(item.ticket_action === "Resolved" || item.ticket_action === "Closed" || item.ticket_action === "Unsolved" || item.ticket_action === "Replied") ?
                        <small className="text-right text-grey-400 text-xs font-mono"><span className="font-bold">{(item.ticket_action)}</span> on  <span className="font-bold">{new Date(item.action_date).toLocaleString("en-IN",{timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}</span></small>
                        :<small className="text-right text-grey-400 text-xs font-mono"><span className="font-bold">{(item.ticket_action)}{" to "}<span className="text-red-500">{(item.action_to_user_name)}<span className="text-orange-700 font-mono"> ({item.action_to_department_name})</span></span></span> on  <span className="font-bold">{new Date(item.action_date).toLocaleString("en-IN",{timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}</span></small>}
                      </div>
                      <p className="whitespace-pre-line text-black px-2 text-sm mb-0">{item.ticket_comment}</p>
                      <div className="text-red-400">{/* Attachments: */}
                        {data && data.length > 0 &&
                        item.uploaded_file_details ? (item.uploaded_file_details.split(",").map((file, indx) => 
                          {const [id, fileName,link] = file.split("|~|");
                              return (
                                <div className="inline-flex items-center gap-[4px] ml-2  mr-2 text-sm text-black cursor-pointer" key={indx}>
                                  <span className="text-blue-400 -mr-1">{<GiPaperClip />}</span>
                                  <span className="text-xs"><a href={`http://192.168.1.127:5000/uploads/${link}`} target="_blank" id={id} rel="noopener noreferrer"><span className="absolute left-1/2 bottom-full hidden max-w-xs -translate-x-1/2 whitespace-normal rounded bg-gray-500 bg-opacity-80 text-white text-sm p-1 group-hover:block">{fileName}</span>{fileName.substring(0, 7)}</a></span>
                                </div>
                              );
                            })) 
                        : (<span className="text-green-500 font-bold px-1 text-xs"> No files attached.</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteGeneratedTicketsDetail;