import BreadCrumb from "../BreadCrumb/BreadCrumb";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineAdd } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
//import { Sidebar } from "../Index.js";
import "./style.css";
import imageCompression from 'browser-image-compression';



const AddTicket = () => {
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tickets", href: "/mytickets" },
    { label: "New Ticket", active: true },
  ];

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  // const [images, setImages] = useState([]);
  const [fileInputs, setFileInputs] = useState([{ id: uuidv4(), file: null }]);
  const maxCount = 300;
  const dept_id = localStorage.getItem("user_department_id");
  const dept_assigner = localStorage.getItem("is_department_assigner");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "site_id") {
      const selectedSite = associatedSite.find(
        (site) => site.site_name === value
      );

      setData((prev) => ({
        ...prev,
        site_id: selectedSite ? selectedSite.site_id : "",
        site_name: value,
      }));
    } else if (name === "department_id") {
      const selectedDept = activeDept.find(
        (dept) => dept.department_name === value
      );

      setData((prev) => ({
        ...prev,
        department_id: selectedDept ? selectedDept.department_id : "",
        department_name: value,
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
          ? selectedDept.current_assigner_department_id
          : "",
      }));
      setIsAssigned(selectedDept.department_id === dept_id ? 1 : 0);
    } else if (name === "user_id") {
      const selectedUser = userList.find((user) => user.user_name === value);
      // console.log(selectedUser);

      setData((prev) => ({
        ...prev,
        user_name: value,
        user_id: selectedUser ? selectedUser.user_id : "",
        user_email: selectedUser ? selectedUser.user_email : "",
        user_role_id: selectedUser ? selectedUser.user_role_id : "",
        user_dept_id: selectedUser ? selectedUser.user_department_id : "",
      }));

      setIsAssigned(selectedUser ? 1 : 0);
    } else {
      autoResize(e);
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const autoResize = (e) => {
    // Reset the height to auto to get the natural scroll height
    e.target.style.height = "auto";
    // Set the height to match the scrollHeight, which is the total height of the content
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


  const associatedSite =
    JSON.parse(localStorage.getItem("associatedSites")) || [];
  // console.log(associatedSite);

  const [files, setFiles] = useState([]);
  const [isAssigned, setIsAssigned] = useState(0);
  const [activeDept, setActiveDept] = useState([]);
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState({
    title: "",
    priority: "",
    site_id: "",
    site_name: "",
    department_id: "",
    department_name: "",
    description: "",
    current_assigner_id: "",
    current_assigner_name: "",
    current_assigner_email: "",
    current_assigner_department_id: "",
    current_assigner_role_id: "",
    is_assign_to_user: "",
    user_id: "",
    user_name: "",
    user_email: "",
    user_role_id: "",
    user_dept_id: "",
  });

  useEffect(() => {
    // console.log("useEffect");
    const token = localStorage.getItem("token");

    const fetchDept = async () => {
      const deptUrl = `${apiUrl}/department/getdepartmentlist/activeDepartments`;
      try {
        const deptRes = await axios.get(deptUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (deptRes.data.status === "success") {
          // console.log(deptRes);
          setActiveDept(deptRes.data.data);
        } else {
          toast.error(`Failed to load ${deptRes.data.message}`);
        }
      } catch (error) {
        // console.log(error);
      }
    };

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
          toast.error(employeeRes.data.message);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchDept();
    if (localStorage.getItem("is_department_assigner")) {
      fetchEmp();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(e);

    const token = localStorage.getItem("token");
  
    const formData = new FormData();
    formData.append("is_assign_to_user", isAssigned);
    formData.append("ticket_title", data.title);
    formData.append("ticket_priority", data.priority);
    formData.append("ticket_description", data.description);
    formData.append("site_id", data.site_id);
    formData.append("site_name", data.site_name);
    formData.append("department_id", data.department_id);
    formData.append("department_name", data.department_name);
    formData.append(
      "current_assigner_id",
      isAssigned == 0 ? data.current_assigner_id : data.user_id
    );
    formData.append(
      "current_assigner_name",
      isAssigned == 0 ? data.current_assigner_name : data.user_name
    );
    formData.append(
      "current_assigner_email",
      isAssigned == 0 ? data.current_assigner_email : data.user_email
    );
    formData.append(
      "current_assigner_department_id",
      isAssigned == 0 ? data.current_assigner_department_id : data.user_dept_id
    );
    formData.append(
      "current_assigner_role_id",
      isAssigned == 0 ? data.current_assigner_role_id : data.user_role_id
    );
    // filteredImages.forEach((image) => {
    //   formData.append("issue_files", image.file);
    // });

    files.forEach((image) => {formData.append("issue_files", image.file)});
    // console.log(e);

    for (const value of formData.values()) {
      // console.log(value);
    }

    //Uncomment to make the API call
    // ---------------------------------
    try {
      const ticketRes = await axios.post(
        `${apiUrl}/ticket/createticket`,
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
        setData({})
        toast.success(ticketRes.data.message, {
          icon: true,
          position: "top-right",
          hideProgressBar: true,
        });
        setTimeout(() => {
          navigate("/mytickets");
        }, 5000);
        // Reset the form and state after success
        formResetHandler();
        setFileInputs([{id:uuidv4(), file:null}])
      } else {
        toast.error(ticketRes.data.message, {position: "top-right",});
        // console.log(ticketRes);
      }
    } catch (error) {
      // console.log(error);
      // toast.error("Something went wrong while creating the ticket");
    }

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
  const handleFileChange = async(e, id) => {
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


  const formResetHandler = () => {
    setData({
      title: "",
      priority: "",
      site_id: "",
      site_name: "",
      department_id: "",
      department_name: "",
      description: "",
      current_assigner_id: [],
      current_assigner_name: "",
      current_assigner_email: "",
      current_assigner_department_id: [],
      current_assigner_role_id: [],
    });
    setFiles([]);
    setInputs([{ id: uuidv4() }]);
    setImages([{ id: uuidv4(), file: null }]);
  };

 

  return (
    <div className="h-full">
      {/* <Sidebar /> */}
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1 w-[98.5%] relative">
        <BreadCrumb items={breadItems} />
        <button
          className="bg-[#000] text-white absolute top-1 right-0 font-semibold px-4 py-1 rounded-md"
          type="button"
          onClick={() => navigate("/mytickets")}
        >
          Back
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-[98.5%] bg-gray-100 border-[1px] border-black"
      >
        <div className="grid relative">
          <div className="bg-[#257180] top-0 py-1 text-[#F8E1B7] text-base">
            <span className="ml-6">Add Ticket Details</span>
          </div>
          {/* <div className="flex-1 px-3">
            <p className="text-2xl underline underline-offset-8">
              Ticket details
            </p>
          </div> */}
          {/* Issue Title & Priority Inputs */}
          <div className="flex-1 max-sm:flex-col grid grid-cols-2 py-2 px-4 gap-2">
            {/* Issue Title */}
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="text-base font-medium text-black"
              >
                Ticket Title <span className="text-red-600 font-bold">* <i className="text-black text-xs">(Max 100 Characters)</i></span>
              </label>
              <input
                type="text"
                placeholder="Enter ticket title"
                className="w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] col-span-2 rounded-md"
                name="title"
                value={data.title}
                onChange={onChangeHandler}
                required
                maxLength={100}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col">
              <label
                htmlFor="priority"
                className="text-base font-medium text-black"
              >
                Priority <span className="text-red-600 font-bold">*</span>
              </label>
              <select
                onChange={onChangeHandler}
                name="priority"
                value={data.priority}
                className="border-[1px] border-[#c5c5c580] py-1 px-2 outline-[#F8E1B7] rounded-md"
                required
              >
                <option value="">Please Select an Option</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Location (Site) */}
            <div className="flex flex-col">
              <label
                htmlFor="site_id"
                className="text-base font-medium text-black"
              >
                Location <span className="text-red-600 font-bold">*</span>
              </label>
              <select
                name="site_id"
                value={data.site_name}
                onChange={onChangeHandler}
                className="border-[1px] border-[#c5c5c580] py-1 px-2 outline-[#F8E1B7] rounded-md"
                required
              >
                {associatedSite.length > 1 ? (
                  <>
                    <option value="">Please Choose an Option</option>
                    {associatedSite.map((site) => (
                      <option key={site.site_id} value={site.site_name}>
                        {site.site_name}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="">Please Choose an Option</option>
                    {associatedSite.map((site) => (
                      <option key={site.site_id} value={site.site_name}>
                        {site.site_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label
                htmlFor="department_id"
                className="text-base font-medium text-black"
              >
                Assign To(Dept.)
                <span className="text-red-600 font-bold">*</span>
              </label>
              <select
                name="department_id"
                value={data.department_name}
                onChange={onChangeHandler}
                className="border-[1px] border-[#c5c5c580] py-1 px-2 outline-[#F8E1B7] rounded-md"
                required
              >
                <option value="">Please Select Option</option>
                {activeDept.map(
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
            </div>

            {dept_id == data.department_id && dept_assigner == "1" && (
              <div className="flex flex-col">
                <label
                  htmlFor="user_id"
                  className="text-base font-medium text-black"
                >
                  Assign To(Employee){" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="user_id"
                  value={data.user_name}
                  onChange={onChangeHandler}
                  className="border-[1px] border-[#c5c5c580] py-1 px-2 outline-rose-600"
                  required
                >
                  <option value="">Please Select Option</option>
                  {userList.map(
                    (user) =>
                      user.user_id > 0 && (
                        <option value={user.user_name} key={user.user_id}>
                          {user.user_name}
                        </option>
                      )
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Description & File Upload */}
          <div className="flex-1 max-sm:grid-cols-1 grid grid-cols-1 px-4 pt-2">
            <label
              htmlFor="description"
              className="text-base font-medium text-black"
            >
              Comments <span className="text-red-600 font-bold">*</span>
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              placeholder="Enter comment here..."
              className="h-12 max-h-[200px] w-full border-[1px] border-[#c5c5c580] py-1 px-3 outline-[#F8E1B7] resize-none rounded-md"
              required
              maxLength={maxCount}
            ></textarea>
            <i className="text-gray-500 text-sm">
              Characters left: {maxCount - data.description.length}
            </i>
          </div>
        </div>

        <hr className="h-[0.5px] w-full bg-gray-500 place-items-center mt-[5px]" />

        {/* File Upload */}
        {/* <div className="flex flex-col px-4">
          <label className="text-base font-medium text-black -mt-3">
            Attach files
            <i className="font-normal">
              {" "}
              (Max 5 files <span>|</span> Allowed type: JPG, JPEG, PNG, PDF{" "}
              <span>|</span> Max Size: 2MB)
            </i>
          </label>
          <div className="h-auto border-[1px] max-w-full border-[#c5c5c580] p-4 bg-white flex flex-col overflow-hidden gap-4 rounded-md">
            {fileInputs.map((input, index) => (
              <div key={input.id} className="lg:w-[70%] xl:w-[40%] flex gap-3">
                <input
                  className="w-full"
                  type="file"
                  name={`file-${index}`}
                  id={`file-input-${input.id}`}
                  onChange={(e) => handleFile(e, input.id)}
                  accept=".jpg, .jpeg, .png, .pdf"
                />
                {fileInputs.length - 1 === index && fileInputs.length < 5 && (
                  <button
                    type="button"
                    onClick={addNewInput}
                    className="text-black font-medium text-sm text-nowrap px-4 py-1 bg-blue-400 rounded-md"
                  >
                    Add
                  </button>
                )}
                {fileInputs.length !== 1 && (
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
        </div> */}

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

        {/* Submit and Reset buttons */}
        <div className="flex justify-start py-2 px-4">
          {/* <div>
              {" "}
              <button
                className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md"
                type="reset"
                onClick={formResetHandler}
              >
                Reset
              </button>
            </div> */}
          <div>
            {" "}
            <button
              className="bg-green-600 text-white font-semibold px-3 py-2 rounded-md mb-2 mt-1"
              type="submit"
            >
              Submit
            </button>
            {/* <button
                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md ml-2"
                type="button"
                onClick={() => navigate("/home")}
              >
                Back
              </button> */}
            <button
              className="bg-red-600 text-white font-semibold px-3 py-2 rounded-md ml-2"
              type="reset"
              onClick={formResetHandler}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
