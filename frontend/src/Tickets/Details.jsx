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
import { toast,ToastContainer } from "react-toastify";
import imageCompression from 'browser-image-compression';



const TicketDetails = () => {
  const isAdmin = localStorage.getItem("permission");
  const apiUrl = import.meta.env.VITE_API_URL;
  // console.log(apiUrl);
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state || {};
  // console.log(ticket);
  const dept_id = parseInt(localStorage.getItem("user_department_id"));
  // console.log(dept_id);

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tickets", href: "/mytickets" },
    { label: "Ticket detail", active: true },
  ];

  // State for the ticket resolver's form and chat messages
  const [files, setFiles] = useState([]);
  const [show, setShow] = useState(false);
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deptList, setDeptList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [actionType, setActionType] = useState("");
  const [ticketAction, setTicketAction] = useState(
    ticket?.last_action !== "Close" ? true : false
  );
  const [fileInputs, setFileInputs] = useState([{ id: uuidv4(), file: null }]);
  const [formData, setFormData] = useState({
    current_assigner_id: "",
    current_assigner_name: "",
    current_assigner_email: "",
    current_assigner_department_id: "",
    current_assigner_department_name: "",
    current_assigner_role_id: "",
  });
  // const updatedForm = {
  //   current_assigner_id: ticket.ticket_assigned_to_id,
  //   current_assigner_department_id: ticket.ticket_assigned_to_dept_id,
  //   current_assigner_role_id: ticket.ticket_assigned_to_role_id,
  //   ticket_comment: comment,
  // };
  // console.log(updatedForm.ticket_comment);

  // const [status, setStatus] = useState(ticket.status);
  // const [priority, setPriority] = useState(ticket.priority);

  // ( Comment Input Handler)
  const onChangeCommentHandler = (e) => {
    const value = e.target.value;
    setComment(value);
    autoResize(e);
  };

  // (Form onChange Handler)
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "department_id") {
      const selectedDept = deptList.find(
        (dept) => dept.department_name === value
      );

      setFormData((prev) => ({
        ...prev,
        current_assigner_id: selectedDept
          ? selectedDept.current_assigner_id
          : "",
        current_assigner_name: selectedDept
          ? selectedDept.current_assigner_name
          : "",
        current_assigner_email: selectedDept
          ? selectedDept.current_assigner_email
          : "",
        current_assigner_role_id: selectedDept
          ? selectedDept.current_assigner_role_id
          : "",
        current_assigner_department_id: selectedDept
          ? selectedDept.department_id
          : "",
        current_assigner_department_name: selectedDept
          ? selectedDept.department_name
          : "",
      }));
      setShow(selectedDept.department_id === dept_id ? true : false);
    } else if (name === "assigner_id") {
      const selectedUser = userList.find((user) => user.user_name === value);

      setFormData((prev) => ({
        ...prev,
        current_assigner_department_name: selectedUser
          ? selectedUser.user_department_name
          : "",
        current_assigner_department_id: selectedUser
          ? selectedUser.user_department_id
          : "",
        current_assigner_role_id: selectedUser ? selectedUser.user_role_id : "",
        current_assigner_id: selectedUser ? selectedUser.user_id : "",
        current_assigner_name: selectedUser ? selectedUser.user_name : "",
        current_assigner_email: selectedUser ? selectedUser.user_email : "",
      }));
    }
  };

  // ( Action Form Handler )
  const showFormHandler = () => {
    setShowForm((prev) => !prev);
  };

  // ( Form Action Handler )
  const actionTypeHandler = (e) => {
    const val = e.target.value;
    // console.log(val);
    if (val === "Reopened") {
      // setFlag
      // setFlag(prev => !prev);
      setFlag(true);
    } else {
      setFlag(false);
    }
    // console.log(flag);
    setActionType(val);
  };

  // ( Text-area Size Handler )
  const autoResize = (e) => {
    // Reset the height to auto to get the natural scroll height
    e.target.style.height = "60px";
    // Set the height to match the scrollHeight, which is the total height of the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };



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

  // ( UseEffect For Fetching Data )
  useEffect(() => {
    // const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

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

      // console.log(res);
      if (res.data.status === "success" && res.data.data) {
        // console.log(res.data.data);
        setDeptList(res.data.data);
      }
    };
    getDepartmentList();

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
        // console.log(res.data.data);
        setData(res.data.data);
      }
    };
    ticketDetail();

    const fetchEmp = async () => {
      const empUrl = `${apiUrl}/user/getalluser/${dept_id}`;
      try {
        const employeeRes = await axios.get(empUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (employeeRes.data.status === "success") {
          // console.log(employeeRes.data.data);
          setUserList(employeeRes.data.data);
        } else {
          // toast.error(employeeRes.data.message, {hideProgressBar: true});
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchEmp();
  }, []);

  useEffect(() => {
    if (showForm === false) {
      setComment("");
      setActionType("");
    }
  }, [showForm]);


  // ( Form Submission Handler )
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log(updatedForm);
    // const issue_files = Array.from(fileInputs.map((files) => files.file));
    // console.log(issue_files);
    const token = localStorage.getItem("token");
    const formDataValues = new FormData();
    formDataValues.append("is_assign_to_user", flag ? 1 : 0);
    formDataValues.append(
      "current_assigner_id",
      actionType === "Reopened"
        ? formData.current_assigner_id
        : ticket.ticket_assigned_to_id
    );
    formDataValues.append(
      "current_assigner_name",
      actionType === "Reopened"
        ? formData.current_assigner_name
        : ticket.ticket_assigned_to_name
    );
    formDataValues.append(
      "current_assigner_email",
      actionType === "Reopened"
        ? formData.current_assigner_email
        : ticket.ticket_assigned_to_email
    );
    formDataValues.append(
      "current_assigner_department_id",
      actionType === "Reopened"
        ? formData.current_assigner_department_id
        : ticket.ticket_assigned_to_dept_id
    );
    formDataValues.append(
      "current_assigner_department_name",
      actionType === "Reopened"
        ? formData.current_assigner_department_name
        : ticket.ticket_raise_to_dept_name
    );
    formDataValues.append(
      "current_assigner_role_id",
      actionType === "Reopened"
        ? formData.current_assigner_role_id
        : ticket.ticket_assigned_to_role_id
    );
    formDataValues.append("ticket_action", actionType);
    formDataValues.append("ticket_comment", comment);
    formDataValues.append("ticket_raise_by_email", ticket.ticket_raise_by_email);
    formDataValues.append("ticket_raise_by_name", ticket.ticket_raise_by_name);
    formDataValues.append("ticket_title", ticket.ticket_title);
    formDataValues.append("ticket_number", ticket.ticket_number);

    files.forEach((image) => {formDataValues.append("issue_files", image.file)});

    // for (const [key, val] of formDataValues.entries()) {
    //   console.log(`${key}--${val}`);
    // }

    for (const value of formDataValues.values()) {
      // console.log(value);
    }

    try {
      const urlEndpoint =
        isAdmin == 1
          ? `${apiUrl}/ticket/updateunsolve/${ticket.ticket_id}`
          : `${apiUrl}/ticket/updateticket/${ticket.ticket_id}`;
      const payload =
        isAdmin == 1
          ? {
              current_assigner_id: ticket.ticket_assigned_to_id,
              current_assigner_department_id: ticket.ticket_assigned_to_dept_id,
              current_assigner_role_id: ticket.ticket_assigned_to_role_id,
              ticket_comment: comment,
              ticket_raise_by_email:ticket.ticket_raise_by_email,
              ticket_raise_by_name:ticket.ticket_raise_by_name,
              ticket_title:ticket.ticket_title,
              ticket_number:ticket.ticket_number,
            }
          : formDataValues;
      const contentType =
        isAdmin == 1 ? "application/json" : "multipart/form-data";

      const res = await axios.put(urlEndpoint, payload, {
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res);
      if (res.data.status === "success") {
        // console.log(ticketResponse);
        // console.log(res.data);
        setShowForm(false);
        toast.success(res.data.message, {
          icon: true,
          position: "top-right",
          hideProgressBar: true,
        });
        setTimeout(() => {
          navigate("/mytickets");
        }, 5000);
        // formResetHandler();
        setFileInputs([{ id: uuidv4(), file: null }]);
      } else {
        toast.error(res.data.message, { hideProgressBar: true });
        // console.log(res);
      }
    } catch (error) {
      // console.log(error);
      // toast.error("Something went wrong while submitting the ticket");
    }

  };


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
            <div className="text-xs mb-1">
              <strong className="font-medium text-sm">Ticket No: </strong>{" "}<span className="text-blue-500 font-medium text-xs"><Link to="/mytickets">{ticket?.ticket_number}</Link></span>
            </div>
            <div className="text-xs">
              <strong className="font-medium text-nowrap text-sm">Date & Time:{" "}</strong><span className="text-xs text-wrap">
                {new Date(ticket?.ticket_date).toLocaleString("en-IN", {timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}
              </span>
            </div>
            <div className="text-xs mb-1">
              <strong className="font-medium text-sm">Priority:</strong>{" "}
              <span className={`${ticket?.ticket_priority === "Low" ? "text-green-600" : ticket?.ticket_priority === "High" ? "text-red-600" : "text-yellow-500"} font-medium text-sm`}>{ticket?.ticket_priority}</span>
            </div>
            <div className="mb-1">
              <strong className="font-medium text-sm">Current Status:</strong>{" "}<span className="text-xs">{ticket?.ticket_status}</span>
            </div>
            <div className="text-xs">
              <strong className="font-medium text-sm">Assigned By:</strong>{" "}<span className="text-xs">{ticket?.ticket_raise_by_name}</span>
            </div>
            <div className="text-xs">
              <strong className="font-medium text-nowrap text-sm">Assigned To:</strong>{" "}<span className="text-xs text-nowrap">{ticket?.ticket_raise_to_dept_name} Department</span>
            </div>
          </div>
          <hr className="bg-black w-full" />
          <section className="text-center text-sm">
            <strong className="font-medium text-sm text-center">Title:</strong><span className="text-wrap whitespace-pre-line text-indigo-800">{ticket?.ticket_title}</span>
          </section>
          {ticketAction && (
            <div className="flex flex-col justify-end xl:h-[6vh] 2xl:h-[18vh]">
              <div className="flex justify-between items-center w-full">
                <button className="bg-[#000] text-white font-semibold px-2 rounded-md" type="button" onClick={() => navigate("/mytickets")}>Back</button>
                <div className="flex items-center py-2 cursor-pointer transform duration-300 ease-in-out">
                  {isAdmin == 1 ? (
                    (ticket.ticket_action === "Reassigned" || ticket.ticket_action === "Assigned") && (
                      <span onClick={showFormHandler} className="inline-flex font-medium text-base border-[1px] border-[#c5c5c580] text-white px-2 rounded-md bg-red-500">
                        {showForm ? (<RiSubtractLine className="relative -ml-2 mt-1" size={15} />) : (<MdOutlineAdd className="relative -ml-2 mt-1" size={15} />)}Mark Unsolved</span>)) 
                        : (<span onClick={showFormHandler} className="font-medium text-sm border-[1px] border-[#c5c5c580] text-white px-2 py-1 rounded-md bg-red-500 flex items-center justify-around hover:cursor-pointer">{showForm ? (<RiSubtractLine className="relative -ml-2 mt-1" size={15} />) : (<MdOutlineAdd className="relative -ml-2 mt-1" size={15} />)}Take Action</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Ticket Raiser & Resolver Chatbox */}
        <div className="w-full lg:h-[50vh] 2xl:h-[40vh] lg:w-[38%] xl:w-[70%] 2xl:w-[75%] bg-yellow-50 border-[1px] border-black py-2 px-4 rounded-md overflow-hidden">
          <h3 className="text-lg text-center font-semibold mb-4 underline underline-offset-8 -mt-2">Ticket Communication</h3>

          {/* Chatbox */}
          <div className="h-[80%] w-full overflow-y-auto mb-4 space-y-1 rounded-md">
            {data.length !== null &&
              data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {idx > 0 && (
                    <div className="flex justify-center items-center">
                      <div className="bg-transparent">
                        <img
                          className="rotate-90 h-[2rem]"
                          src={arrow}
                          alt="arrow"
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex justify-center w-full ${
                      item.action_by_user_name ===
                      localStorage.getItem("user_name")
                        ? "bg-[#69afec3b]"
                        : "bg-[#d1f7d3]"
                    }`}
                  >
                    <div className="rounded-lg shadow-sm w-full max-w-full p-1">
                      <div className="flex justify-between px-1">
                      <strong className="text-left text-red-500 text-xs font-serif">{(item.action_by_user_name)}  <span className="text-orange-700 font-mono">{item.action_by_department_name ===null ? "" : "("+ item.action_by_department_name +")"}</span></strong>
                        {(item.ticket_action === "Resolved" || item.ticket_action === "Closed" || item.ticket_action === "Unsolved" || item.ticket_action === "Replied") ?
                        <small className="text-right text-grey-400 text-xs font-mono"><span className="font-bold">{(item.ticket_action)}</span> on  <span className="font-bold">{new Date(item.action_date).toLocaleString("en-IN",{timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}</span></small>
                        :<small className="text-right text-grey-400 text-xs font-mono"><span className="font-bold">{(item.ticket_action)}{" to "}<span className="text-red-500">{(item.action_to_user_name)}<span className="text-orange-700 font-mono"> ({item.action_to_department_name})</span></span></span> on  <span className="font-bold">{new Date(item.action_date).toLocaleString("en-IN",{timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",minute: "2-digit", hour12: true})}</span></small>}
                      </div>
                      <p className="text-wrap text-sm px-2 mb-1">
                        {item.ticket_comment}
                      </p>
                      <div className="text-red-400 text-base">
                        {data &&
                        data.length > 0 &&
                        item.uploaded_file_details ? (
                          item.uploaded_file_details
                            .split(",")
                            .map((file, indx) => {
                              const [id, fileName, link] = file.split("|~|");
                              // console.log(link);

                              return (
                                <div
                                  className="inline-flex items-center gap-[4px] ml-2  mr-2 text-sm text-black cursor-pointer"
                                  key={indx}
                                >
                                  <span className="text-blue-400 -mr-1">
                                    {<GiPaperClip />}
                                  </span>
                                  <span className="text-xs relative group">
                                    <a
                                      href={`http://192.168.1.127:5000/uploads/${link}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    ><span className="absolute left-1/2 bottom-full hidden max-w-xs -translate-x-1/2 whitespace-normal rounded bg-gray-500 bg-opacity-80 text-white text-sm p-1 group-hover:block">{fileName}</span>
                                      {fileName.substring(0, 7)}
                                    </a>
                                  </span>
                                </div>
                              );
                            })
                        ) : (
                          <span className="text-green-500 text-xs font-medium px-1">
                            {" "}
                            No files attached.{" "}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Chat Input */}
          {/* <div className="flex gap-2">
            <textarea
              value={comment}
              onChange={onChangeCommentHandler}
              placeholder="Type your message..."
              className="w-full bg-white border-[1px] border-black rounded-lg p-2"
            />
            <button
              className="bg-[#3B1E54] text-white px-4 py-2 rounded-lg"
              onClick={onUpdateTicketHandler}
            >
              Send
            </button>
          </div> */}
        </div>
      </div>

      {showForm && (
        <div
          className={`border-[1px] border-black transform transition-all duration-1000 ease-in-out bg-yellow-50 w-full mt-2 ${
            showForm ? "h-auto opacity-100" : "h-0 opacity-0"
          } rounded-md pb-2 overflow-hidden mt-1`}
        >
          <form
            onSubmit={onSubmitHandler}
            className="h-auto w-full flex flex-col bg-yellow-50 filter-[5px] rounded-md mt-2"
          >
            {/* Action Option Control Area*/}
            {isAdmin != 1 && (
              <div className="px-4 mt-2 flex items-center gap-1 text-nowrap">
                <label className="text-sm font-medium">
                  Choose action
                  <span className="text-red-600 font-medium"> *</span>
                </label>
                <select
                  className="border-[1px] py-1 px-1 border-[#c5c5c580] outline-rose-800"
                  onChange={actionTypeHandler}
                >
                  <option value="">Select an Option</option>
                  {ticket?.ticket_action === "Unsolved" ? (
                    <>
                      <option value="Reopened">Re-open</option>
                      <option value="Closed">Close</option>
                    </>
                  ) : ticket?.ticket_action === "Opened" ||
                    ticket?.ticket_action === "Reopened" ? (
                    <>
                      <option value="Replied">Reply</option>
                      <option value="Closed">Close</option>
                    </>
                  ) : ticket?.ticket_action === "Resolved" ? (
                    <>
                      <option value="Reopened">Re-open</option>
                      <option value="Closed">Close</option>
                    </>
                  ) : ticket?.ticket_action === "Assigned" ||
                    ticket?.ticket_action === "Reassigned" ? (
                    <>
                      <option value="Replied">Reply</option>
                    </>
                  ) : (
                    <>
                      <option value="Reopened">Re-Open</option>
                    </>
                  )}
                </select>
                {actionType === "Reopened" ? (
                  <>
                    <label
                      htmlFor="department_id"
                      className="font-medium ml-2 text-sm text-wrap"
                    >
                      Assign To(Dept.)
                    </label>
                    <span className="text-red-600 font-bold">*</span>
                    <select
                      name="department_id"
                      className="border-[1px] py-1 px-1 border-[#c5c5c580] outline-rose-800"
                      onChange={onChangeHandler}
                    >
                      <option value="">Select an Option</option>
                      {deptList.map(
                        (dept) =>
                          dept.current_assigner_id > 0 && (
                            <option
                              value={dept.department_name}
                              id={dept.department_id}
                              key={dept.department_id}
                            >
                              {dept.department_name}
                            </option>
                          )
                      )}
                    </select>
                  </>
                ) : (
                  <></>
                )}
                {show && actionType === "Reopened" && (
                  <>
                    <label
                      htmlFor="assigner_id"
                      className="text-sm font-medium text-black ml-2 text-wrap"
                    >
                      Assign To(Emp.){" "}
                    </label>
                    <span className="text-red-600 font-bold">*</span>
                    <select
                      name="assigner_id"
                      value={data.user_name}
                      onChange={onChangeHandler}
                      className="border-[1px] border-[#c5c5c580] py-1 px-1 outline-rose-600"
                      required
                    >
                      <option value="">Select an Option</option>
                      {userList.map(
                        (user) =>
                          user.user_id > 0 && (
                            <option value={user.user_name} key={user.user_id}>
                              {user.user_name}
                            </option>
                          )
                      )}
                    </select>
                  </>
                )}
              </div>
            )}
            {/* Comment Upload Area*/}
            <div className="flex flex-col px-4 mt-1">
              <label className="font-medium text-sm">
                Comments <span className="text-red-600 font-medium">*</span>
              </label>
              <textarea
                required
                value={comment}
                className="h-16 max-h-[120px] px-3 py-1 border-[1px] border-[#c5c5c580] resize-none"
                placeholder="Type your message..."
                onChange={onChangeCommentHandler}
              ></textarea>
            </div>
            {/* Image Upload Area*/}

            {isAdmin != 1 && (
              <div className="flex-1 max-sm:grid-cols-1 grid grid-cols-1 p-1 mt-1 mx-2 gap-3">
                <div className="flex-1 flex flex-col">
                  <label className="font-medium text-black text-sm">Attach files<i className="font-normal">{" "}(Max 5 files <span>|</span> Allowed type: JPG, JPEG, PNG & PDF <span>|</span> Max Size: 2MB)</i></label>
                  <div className="file-upload-container h-auto border-[1px] max-w-full border-[#c5c5c580] p-2 bg-white flex flex-col overflow-hidden gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="file-input-group flex items-center gap-2">
                        <input type="file" accept="image/*, .pdf" onChange={(e) => handleFileChange(e, file.id)} className="file-input" id={`file-input-${file.id}`}/>
                        <button type="button" onClick={() => handleRemoveFileInput(file.id)} className="remove-button inline-flex text-slate-200 font-medium px-2 py-1 bg-red-600 rounded-md w-auto max-w-[100px]"> <RiSubtractLine className="py-0 mt-1 -ml-2" size={18} />Remove</button>
                      </div>
                    ))}
                    {files.length < 5 && (<button type="button" onClick={handleAddFileInput} className="add-button inline-flex text-black font-medium text-sm text-nowrap py-1 border bg-blue-400 rounded-md w-auto max-w-[60px]"><MdOutlineAdd className="py-1" size={20} />Add</button>)}
                  </div>
                </div>
              </div>
            )}
            {/* Button Area*/}
            <div className="px-3 pb-2">
              <button
                type="submit"
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mt-2 ml-2"
                // onClick={onSubmitHandler}
              >
                Update
              </button>
              {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/allTickets")}
              >
                Back
              </button> */}
            </div>
          </form>
          <ToastContainer/>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
