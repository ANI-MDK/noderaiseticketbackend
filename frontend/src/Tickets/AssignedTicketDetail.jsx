import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import arrow from "../assets/arrows.png";
import { MdOutlineAdd } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GiPaperClip } from "react-icons/gi";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';



const AssignedTicketDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state || {};
  //console.log(ticket);
  //console.log(ticket?.ticket_id)

  const breadItems = [
    { label: "Home" },
    { label: "Assigned Tickets" },
    { label: "Assigned Ticket Detail", active: true },
  ];

  // State for the ticket resolver's form and chat messages
  const [data, setData] = useState([]);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deptList, setDeptList] = useState([]);
  const [dept, setDept] = useState({});
  const [actionType, setActionType] = useState('');
  const [show, setShow] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState({});
  const [ticketAction, setTicketAction] = useState((ticket?.ticket_status != "Close") && (ticket?.ticket_status != "Resolve") ? true : false);
  const [files, setFiles] = useState([]);

  // ( Comment Input Handler)
  const onChangeCommentHandler = (e) => {
    const value = e.target.value;
    setComment(value);
    autoResize(e);
  };

  // ( Action Form Handler )
  const showFormHandler = () => {
    setShowForm((prev) => !prev);
    setFiles([]);
    setComment('');
    setActionType('')
    setShow(false);
  };

  // ( Form Action Handler )
  const actionTypeHandler = (e) => {
    const val = e.target.value;
    setActionType(val);
    setShow(false)
    if(val==="Resolved" || val === "Replied"){
      setDept({});
      setEmployee({});
    }
  };

  

  // ( Dept dropdown Handler )
  const deptHandler =(e) =>{
    //console.log(e)
    const Id = parseInt(e.target.value);
    if(Id==localStorage.getItem("user_department_id")){
      setShow(true);
      const employeeList = async () => {
        const res = await axios.get(
          `${apiUrl}/user/getalluser/${Id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //console.log(res);
        if (res.data.status === "success") {
          //console.log(res.data.data);
          setEmployeeList(res.data.data);
        }
      };
      employeeList();
    }
    else{
      setShow(false);
      setEmployee({})
    };
    const matchedDept = deptList.find((dept) =>{if(Id === dept.department_id){return(dept)}});
    //console.log(matchedDept)
    setDept(matchedDept);
  }



  const employeeHandler=(e)=>{
    //console.log(e)
    const id = parseInt(e.target.value);
    const matchedEmployee = employeeList.find((employee) =>{
      if(id === employee.user_id){return(employee)}});
    setEmployee(matchedEmployee);
    //console.log(matchedEmployee)
  }



  // Handle adding a new file input
  const handleAddFileInput = () => {
    setFiles((prevFiles) => [
      ...prevFiles,
      { id:uuidv4(), file: null }, // Add a new file object with a unique ID
    ]);
  };

  // Handle removing a file input
  const handleRemoveFileInput = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  // Handle file selection
  const handleFileChange = async (e, id) => {
    const newFile = e.target.files[0];

    if (!newFile) return;
    let processedFile = newFile;
    // Compress the file if it's an image
    if (newFile.type.startsWith('image/')) {
      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1024, // Max dimensions
        useWebWorker: true, // Enable web worker for better performance
      };
  
      try {
        const compressedBlob = await imageCompression(newFile, options);
      // Create a new File object with the original name and the compressed Blob
      processedFile = new File([compressedBlob], newFile.name, { type: newFile.type });
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, file: processedFile } : file
      )
    );
  };


  // ( Text-area Size Handler )
  const autoResize = (e) => {
    // Reset the height to auto to get the natural scroll height
    e.target.style.height = "auto";
    // Set the height to match the scrollHeight, which is the total height of the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


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

  const getDepartmentList = async () => {
    const res = await axios.get(
      `${apiUrl}/department/getdepartmentlist/departments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //console.log(res);
    if (res.data.status === "success" && res.data.data) {
      //console.log(res.data.data);
      setDeptList(res.data.data);
    }
  };

  // ( UseEffect For Fetching Data )
  useEffect(() => {
    getDepartmentList();
    ticketDetail();
  }, []);


  const handelSubmit= async (e)=>{
    e.preventDefault();
    //console.log(files);
    //console.log(dept);
    //console.log(employee);

    const formData = new FormData();

    if(actionType === "Resolved" || actionType === "Replied"){
        formData.append("current_assigner_id", ticket.ticket_assigned_to_id);
        formData.append("current_assigner_name",ticket.ticket_assigned_to_name);
        formData.append("current_assigner_email", ticket.ticket_assigned_to_email);
        formData.append("current_assigner_department_id", ticket.ticket_assigned_to_dept_id);
        formData.append("current_assigner_department_name", ticket.ticket_assigned_to_dept_name);
        formData.append("current_assigner_role_id", ticket.ticket_assigned_to_role_id);
    }
    else if(Object.keys(employee).length === 0){
        // console.log(dept);
        formData.append("current_assigner_id", dept.current_assigner_id);
        formData.append("current_assigner_name",dept.current_assigner_name);
        formData.append("current_assigner_email", dept.current_assigner_email);
        formData.append("current_assigner_department_id", dept.current_assigner_department_id);
        formData.append("current_assigner_department_name", dept.department_name);
        formData.append("current_assigner_role_id", dept.current_assigner_role_id);
    }
    else{
        // console.log(employee);
        formData.append("current_assigner_id", employee.user_id);
        formData.append("current_assigner_name",employee.user_name);
        formData.append("current_assigner_email", employee.user_email);
        formData.append("current_assigner_department_id", employee.user_department_id);
        formData.append("current_assigner_department_name", employee.user_department_name);
        formData.append("current_assigner_role_id", employee.user_role_id);
    }

    files.forEach((image) => {formData.append("issue_files", image.file)});
    formData.append("is_assign_to_user",(actionType === "Assigned" || actionType === "Reassigned") ? 1 : 0);
    formData.append("ticket_action", actionType);
    formData.append("ticket_comment", comment);
    formData.append("ticket_raise_by_email", ticket.ticket_raise_by_email);
    formData.append("ticket_raise_by_name", ticket.ticket_raise_by_name);
    formData.append("ticket_title", ticket.ticket_title);
    formData.append("ticket_number", ticket.ticket_number);


    // API call //
    try {
      const ticketRes = await axios.put(
        `${apiUrl}/ticket/updateticket/${ticket?.ticket_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (ticketRes.data.status === "success") {
        // console.log(ticketRes);
        setShowForm(false);
        toast.success(ticketRes.data.message, {
          icon: true,
          position: "top-right",
          // style: {
          //   backgroundColor: "#c1e8da",
          //   color: "#3c6e57",
          //   fontWeight: "600",
          //   textAlign: "center",
          //   marginLeft: "8rem",
          //   width: "100%",
          // },
          hideProgressBar: true,
        });
        setTimeout(()=>{
          navigate("/assignedtickets");
        },5000);

      } else {
        toast.error(ticketRes.data.message);
        // console.log(ticketRes);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong.");
    }

    // for (let pair of formData.entries()) {console.log(`${pair[0]}: ${pair[1]}`)}

  }



  return (
    <div className="absolute w-[98.5%] mb-[10%]">
      {/* <Sidebar /> */}
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-full relative">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex w-full gap-2 2xl:gap-3">
        {/* Ticket Details Section */}
        <div className="w-full lg:w-[60%] xl:w-[30%] lg:h-[50vh] 2xl:h-[40vh]  border-[1px] border-black py-2 px-4 rounded-md overflow-y-auto bg-yellow-50">
          <h3 className="text-lg text-center font-semibold mb-4 underline underline-offset-8 -mt-2">Ticket Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="text-xs mb-1"><strong>Ticket No: </strong>{" "}<span className="text-blue-500 font-medium text-xs"><Link to="/assignedtickets">{ticket?.ticket_number}</Link></span></div>
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
          <div className="flex flex-col justify-end xl:h-[6vh] 2xl:h-[18vh]">
            {/* Back Button Aligned to the Bottom Left */}
            <div className="flex justify-between items-center w-full">
              <button className="bg-[#000] text-white font-semibold px-2 rounded-md" type="button"onClick={() => navigate("/assignedtickets")}>Back</button>
              {ticketAction && (
                <div className="flex items-center py-2 cursor-pointer transform duration-300 ease-in-out" onClick={showFormHandler}>
                  {showForm ? <RiSubtractLine size={15} /> : <MdOutlineAdd size={15} />}
                  <div className="flex gap-3 items-center">
                    <span className="font-medium text-base border-[1px] border-[#c5c5c580] text-white px-2 rounded-md bg-red-500">Take Action</span>
                  </div>
                </div>
              )}
            </div>
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
                      <p className="whitespace-pre-line text-black px-2 text-sm">{item.ticket_comment}</p>
                      <div className="text-red-400">{/* Attachments: */}
                        {data && data.length > 0 &&
                        item.uploaded_file_details ? (item.uploaded_file_details.split(",").map((file, indx) => 
                          {const [id, fileName,link] = file.split("|~|");
                              return (
                                <div className="inline-flex items-center gap-[4px] ml-2  mr-2 text-sm text-black cursor-pointer" key={indx}>
                                  <span className="text-blue-400 -mr-1">{<GiPaperClip />}</span>
                                  <span className="text-xs"><a href={`${apiUrl}/uploads/${link}`} target="_blank" id={id} rel="noopener noreferrer"><span className="absolute left-1/2 bottom-full hidden max-w-xs -translate-x-1/2 whitespace-normal rounded bg-gray-500 bg-opacity-80 text-white text-sm p-1 group-hover:block">{fileName}</span>{fileName.substring(0, 7)}</a></span>
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
      
      {showForm && (
        <div className={`border-[1px] border-black transform transition-all duration-1000 ease-in-out  bg-yellow-50 lg:w-[99%] xl:w-[100%] 2xl:w-[100%] mt-2 ${showForm ? "h-auto opacity-100" : "max-h-0 opacity-0"} overflow-hidden rounded-md`}>
          <form onSubmit={handelSubmit}>
            {/* Action Option Control Area*/}
            <div className="p-1 pb-0 mt-1 mx-2 flex items-center gap-3 text-nowrap">
              <label className="text-sm font-medium ">Choose action<span className="text-red-600 font-medium"> *</span></label>
              <select className="lg:w-[35%] xl:w-[20%] 2xl:w-[15%] border-[1px] px-2 border-[#c5c5c580] outline-rose-800" onChange={actionTypeHandler} required>
                <option value="">Please Select</option>
                {(ticket?.is_department_assigner==1) && (ticket?.ticket_action === "Opened" || ticket?.ticket_action === "Reopened") ? (
                  <>
                    <option value="Assigned">Assign</option>
                    <option value="Resolved">Resolve</option>
                    <option value="Replied">Reply</option>
                  </>
                ) : (ticket?.is_department_assigner==1) && (ticket?.is_last_assigned_to_user==1) && (ticket?.ticket_action === "Assigned" || ticket?.ticket_action === "Reassigned") ? (
                  <>
                    <option value="Reassigned">Reassign</option>
                    <option value="Resolved">Resolve</option>
                    <option value="Replied">Reply</option>
                  </>
                ) : (ticket?.is_department_assigner==0) && (ticket?.is_last_assigned_to_user==1) ? (
                  <>
                    <option value="Reassigned">Reassign</option>
                    <option value="Resolved">Resolve</option>
                    <option value="Replied">Reply</option>
                  </>)
                : (ticket?.is_last_assigned_to_user==0) ? (
                  <>
                    <option value="Replied">Reply</option>
                  </>)
                :(<>{''}</>)}
              </select>
              {(actionType === "Assigned" || actionType === "Reassigned") ? (
                <>
                  <label className="text-sm font-medium">Choose Department<span className="text-red-600 font-medium"> *</span></label>
                  <select className="w-[20%] border-[1px] px-2 border-[#c5c5c580] outline-rose-800" onChange={deptHandler} required>
                    <option value="">Please Select</option>
                    {deptList.map(
                      (dept,i) =>dept.current_assigner_id > 0 && (<option value={dept.department_id} key={i}>{dept.department_name}</option>))}
                  </select>
                </>
              ) : null}
              {show ? 
              <>
                <label className="text-sm font-medium">Choose Employee<span className="text-red-600 font-medium"> *</span></label>
                <select className="w-[20%] border-[1px] px-2 border-[#c5c5c580] outline-rose-800" onChange={employeeHandler} required>
                  <option value="">Please Select</option>
                  {employeeList.map(
                    (emp,i) =>(<option value={emp.user_id} key={i}>{emp.user_name}</option>))}
                </select>
              </>: ""}
            </div>

            {/* Comment Upload Area*/}
            <div className="flex flex-col p-1 mt-1 mx-2">
              <label className="font-medium text-sm">Comments <span className="text-red-600 font-medium">*</span></label>
              <textarea value={comment} className="h-12 max-h-[130px] px-2 py-2 border-[1px] border-[#c5c5c580] resize-none" placeholder="Type your message..." onChange={onChangeCommentHandler} required></textarea>
            </div>

            {/* Image Upload Area*/}
            <div className="flex-1 max-sm:grid-cols-1 grid grid-cols-1 p-1 mt-1 mx-2 gap-3">
              <div className="flex-1 flex flex-col">
                <label className="font-medium text-black text-sm">Attach files<i className="font-normal">{" "}(Max 5 files <span>|</span> Allowed type: JPG, JPEG, PNG & PDF <span>|</span> Max Size: 2MB)</i></label>
                <div className="file-upload-container h-auto border-[1px] max-w-full border-[#c5c5c580] p-2 bg-white flex flex-col overflow-hidden gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="file-input-group flex items-center gap-2">
                      <input type="file" accept="image/*, .pdf" onChange={(e) => handleFileChange(e, file.id)} className="file-input" id={`file-input-${file.id}`}/>
                      <button type="button" onClick={() => handleRemoveFileInput(file.id)} className="remove-button text-white font-medium px-2 py-1 bg-red-600 rounded-md w-auto max-w-[100px]">Remove</button>
                    </div>
                  ))}
                  {files.length < 5 && (<button type="button" onClick={handleAddFileInput} className="add-button text-black font-medium text-sm text-nowrap py-1 bg-blue-400 rounded-md w-auto max-w-[60px]">Add</button>)}
                </div>
      
              </div>
            </div>
            {/* Submit Button */}
            <div className="p-1 mb-3">
              <button type="submit" className="bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-md mt-2 ml-2" >Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssignedTicketDetail;
