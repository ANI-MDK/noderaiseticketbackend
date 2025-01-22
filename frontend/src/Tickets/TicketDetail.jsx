import { useEffect, useState } from "react";
import { Sidebar } from "../Index";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { GiPaperClip } from "react-icons/gi";
import axios from "axios";
import arrow from "../assets/arrows.png";
import { MdOutlineAdd } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

const TicketDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state || {};
  // console.log(ticket);

  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tickets", href: "/mytickets" },
    { label: "Ticket detail", active: true },
  ];

  const [deptList, setDeptList] = useState([]);
  const [data, setData] = useState([]);
  const [comment, setComment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [ticketAction, setTicketAction] = useState(
    ticket?.last_action !== "Close" ? true : false
  );
  const [images, setImages] = useState([]);
  const [inputs, setInputs] = useState([{ id: uuidv4() }]);

  // ( UseEffect For Fetching Data )
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
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
  }, []);

  // ( Comment Input Handler)
  const onChangeCommentHandler = (e) => {
    const value = e.target.value;
    setComment(value);
    autoResize(e);
  };

  // ( Action Form Handler )
  const showFormHandler = () => {
    setShowForm((prev) => !prev);
  };

  // ( Form Action Handler )
  const actionTypeHandler = (e) => {
    const val = e.target.value;
    setActionType(val);
  };

  // ( Text-area Size Handler )
  const autoResize = (e) => {
    // Reset the height to auto to get the natural scroll height
    e.target.style.height = "auto";
    // Set the height to match the scrollHeight, which is the total height of the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle file selection for input fields
  const addImage = (e) => {
    const selectedFile = e.target.files[0];

    // Only proceed if a file is selected
    if (selectedFile) {
      setImages((prevImg) => {
        // Add the new file to the updated array
        return [...prevImg, { file: selectedFile }];
      });
    }
  };

  // Add a new input field for image file
  const addNewInput = () => {
    const newId = uuidv4(); // Generate a unique ID for the new input
    setInputs((prevInputs) => [...prevInputs, { id: newId }]);
    setImages((prevImages) => [...prevImages, { file: null }]);
  };

  // Remove input field and corresponding image
  const removeInput = (id) => {
    setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  return (
    <div className="main h-auto mt-10 mb-[10%] relative">
      {/* <Sidebar /> */}
      <div className="relative mb-1 flex items-center lg:w-[98%] xl:w-[99%] 2xl:w-[97%]">
        <BreadCrumb items={breadItems} />
        <button
          className="bg-[#000] text-white font-semibold px-4 py-2 rounded-md absolute lg:right-0 xl:right-0 2xl:right-0"
          type="button"
          onClick={() => navigate("/mytickets")}
        >
          Back
        </button>
      </div>
      <div className="h-auto w-[80%] bg-[#342056] border-[1px] border-black lg:w-[70vw] xl:w-[75vw] 2xl:w-[80vw] max-w-full flex-col justify-start items-center overflow-hidden">
        <div className="h-full w-full flex flex-col bg-gray-100 filter-[5px] mt-5 p-3">
          <h3 className="text-xl font-semibold mb-3 underline underline-offset-8">
            Ticket Details
          </h3>
          <div className=" grid grid-rows-2 grid-flow-col gap-2 mb-2">
            <div className="t_id flex items-center gap-2 text-nowrap">
              <span className="font-medium">Ticket No: </span>{" "}
              <span className="text-blue-500 font-medium text-sm">
                {ticket?.ticket_number}
              </span>
            </div>
            <div className="t_title flex items-center gap-2 text-nowrap">
              <span className="font-medium">Ticket Title:</span>{" "}
              <span className="text-wrap capitalize">
                {ticket?.ticket_title}
              </span>
            </div>
            <div className="t_date flex items-center gap-2 text-nowrap">
              <span className="font-medium">Date: </span>
              <span>
                {new Date(ticket?.ticket_date).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </div>
            <div className="t_time flex items-center gap-2 text-nowrap">
              <span className="font-medium">Time: </span>
              <span>
                {new Date(ticket?.ticket_date).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </div>
            <div className="t_requester flex items-center gap-2 text-nowrap">
              <span className="font-medium">Issued By:</span>{" "}
              <span className="text-wrap uppercase font-medium text-blue-400">
                {ticket?.ticket_raise_by_name}
              </span>
            </div>
            <div className="t_dept flex items-center gap-2 text-nowrap">
              <span className="font-medium">Assign To(Dept.):</span>{" "}
              <span className="uppercase font-medium text-orange-400">
                {ticket?.ticket_raise_to_dept_name}
              </span>
            </div>
            <div className="t_status flex items-center gap-2 text-nowrap">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`${
                  ticket?.ticket_status === "Open"
                    ? "text-green-600"
                    : ticket?.ticket_status === "Close"
                    ? "text-red-600"
                    : "text-yellow-600" // Default case (for Medium priority)
                } font-medium uppercase`}
              >
                {ticket?.ticket_status}
              </span>
            </div>
            <div className="t_priority flex items-center gap-2 text-nowrap">
              <span className="font-medium">Priority:</span>{" "}
              <span
                className={`${
                  ticket?.ticket_priority === "Low"
                    ? "text-green-600"
                    : ticket?.ticket_priority === "High"
                    ? "text-red-600"
                    : "text-yellow-600" // Default case (for Medium priority)
                } font-medium uppercase`}
              >
                {ticket?.ticket_priority}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-auto w-[80%] border-[1px] border-black lg:w-[70vw] xl:w-[75vw] 2xl:w-[80vw] max-w-full flex-col justify-start items-center overflow-hidden mt-[0.2%] shadow-md">
        <div className="flex justify-between items-center gap-2 text-nowrap">
          <h3 className="text-xl font-semibold mb-2 underline underline-offset-8 px-3">
            Comments
          </h3>
          <button
            onClick={showFormHandler}
            className="flex items-center font-medium px-3 py-1 mt-1 mr-4 bg-[#4C1F7A] text-white rounded-md"
            type="button"
          >
            {showForm ? (
              <RiSubtractLine size={25} />
            ) : (
              <MdOutlineAdd size={25} />
            )}{" "}
            Take Action
          </button>
        </div>
        {/* Chatbox */}
        <div className="h-[80%] w-full overflow-y-auto mb-4 p-3">
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
                  <div className="p-1 rounded-lg shadow-sm w-full max-w-full">
                    <strong className="block">
                      {item.action_by_user_name}
                    </strong>
                    <small className="text-blue-700">
                      {new Date(item.action_date).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </small>
                    <p>{item.ticket_comment}</p>
                    <div className="text-red-400 tex-base">
                      Attachments:
                      {data && data.length > 0 && item.uploaded_file_details ? (
                        item.uploaded_file_details
                          .split(",")
                          .map((file, indx) => {
                            const [id, fileName] = file.split("|~|");
                            return (
                              <div
                                className="inline-flex items-center gap-[2px] ml-3 text-sm text-black cursor-pointer"
                                key={indx}
                              >
                                <span className="text-blue-400 ">
                                  {<GiPaperClip />}
                                </span>
                                <span className="text-sm">
                                  {fileName.substring(0, 3).toUpperCase()}
                                </span>
                              </div>
                            );
                          })
                      ) : (
                        <span className="text-black text-sm">
                          {" "}
                          No attachments available{" "}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showForm && (
        <div
          className={`border-[1px] border-black transform transition-all duration-300 ease-in-out bg-gray-100 lg:w-[70vw] xl:w-[75vw] 2xl:w-[80vw] max-w-full ${
            showForm ? "h-auto opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden mt-[0.2%]`}
        >
          <form>
            {/* Action Option Control Area*/}
            <div className="p-3 pb-0 mt-2 mx-2 flex items-center gap-3 text-nowrap">
              <label className="text-base font-medium">
                Choose action
                <span className="text-red-600 font-medium"> *</span>
              </label>
              <select
                className="lg:w-[35%] xl:w-[25%] 2xl:w-[15%] border-[1px] py-1 px-2 border-[#c5c5c580] outline-rose-800"
                onChange={actionTypeHandler}
              >
                <option value="">Please choose an option</option>
                {ticket?.ticket_action === "Opened" ||
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
                  <></>
                )}
              </select>
              {actionType === "Replied" ? (
                <>
                  <label className="font-medium">
                    Choose Department
                    <span className="text-red-600 font-medium"> *</span>
                  </label>
                  <select className="w-[25%] border-[1px] py-1 px-2 border-[#c5c5c580] outline-rose-800">
                    <option value="">Please Select Option</option>
                    {deptList.map(
                      (dept) =>
                        dept.current_assigner_id > 0 && (
                          <option
                            value={dept.department_name}
                            key={dept.department_id}
                          >
                            {dept.department_name}
                          </option>
                        )
                    )}
                  </select>
                </>
              ) : actionType === "Closed" ? (
                <>
                  <label className="font-medium">Assign to:</label>
                  <select className="w-[45%] border-[1px] py-1 px-2 border-[#c5c5c580] outline-rose-800">
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                  </select>
                </>
              ) : null}
            </div>
            {/* Comment Upload Area*/}
            <div className="flex flex-col p-3 pt-3 mx-2">
              <label className="font-medium">
                Comments <span className="text-red-600 font-medium">*</span>
              </label>
              <textarea
                value={comment}
                className="h-20 max-h-[130px] px-3 py-1 border-[1px] border-[#c5c5c580] resize-none"
                placeholder="Type your message..."
                onChange={onChangeCommentHandler}
              ></textarea>
            </div>
            {/* Image Upload Area*/}
            <div className="flex-1 max-sm:grid-cols-1 grid grid-cols-1 px-4 py-1 gap-3">
              <div className="flex-1 flex flex-col">
                <label className="text-base font-medium text-black">
                  Attach files
                  <i className="font-normal">
                    {" "}
                    (Max 5 files <span>|</span> Allowed type: JPG, JPEG, PNG,
                    PDF <span>|</span> Max Size: 2MB)
                  </i>
                </label>
                <div className="h-auto border-[1px] max-w-full border-[#c5c5c580] p-4 bg-white flex flex-col overflow-hidden gap-4">
                  {inputs.map((input, index) => (
                    <div
                      key={input.id}
                      className="lg:w-[70%] xl:w-[40%] flex gap-3"
                    >
                      <input
                        className="w-full"
                        type="file"
                        name={`file-${index}`}
                        id={`file-${index}`}
                        onChange={(e) => addImage(e, input.id)}
                        accept=".jpg, .jpeg, .png, .pdf"
                      />
                      {inputs.length - 1 === index &&
                        inputs.length < 5 &&
                        images && (
                          <button
                            type="button"
                            onClick={addNewInput}
                            className="text-black font-medium text-sm text-nowrap px-4 py-1 bg-blue-400 rounded-md"
                          >
                            Add
                          </button>
                        )}
                      {inputs.length !== 1 && (
                        <button
                          type="button"
                          onClick={() => removeInput(input.id)}
                          className="text-white font-medium px-2 py-1 bg-red-600 rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Button Area*/}
            <div className="p-3">
              <button
                type="button"
                className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mt-2 ml-2"
                // onClick={() => console.log(actionType)}
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
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
