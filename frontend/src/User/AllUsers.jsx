import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import "./style.css";
import Toggler from "../Components/Toggler";

const AllUsers = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const breadItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "All Users", href: "/allusers", active: true },
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
        width: "52px",
      },
    },
  };

  //dummy data
  const data = [
    {
      user_name: "John Doe",
      user_site_names: "Site A, Site B",
      is_active: "1", // Active status
    },
    {
      user_name: "Jane Smith",
      user_site_names: "Site C",
      is_active: "0", // Inactive status
    },
    {
      user_name: "Michael Johnson",
      user_site_names: "Site D, Site E, Site F",
      is_active: "1", // Active status
    },
    {
      user_name: "Emily Davis",
      user_site_names: "Site G",
      is_active: "0", // Inactive status
    },
    {
      user_name: "Daniel Brown",
      user_site_names: "Site H, Site I",
      is_active: "1", // Active status
    },
  ];

  // Field types
  const columns = [
    {
      name: "Sl_No.",
      selector: (row, index) => index + 1,
      // style: {marginLeft:'10px'}
    },
    {
      name: `Name`,
      selector: (rows) => rows.user_name,
      sortable: true,
    },
    {
      name: 'Department',
      selector: (rows) => rows.user_department_name,
      sortable: true,
    },
    {
      name: "Associated Sites",
      selector: (rows) => rows.user_site_names,
      wrap: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: (rows) => {
        return (
          <Toggler
            active={rows.is_active === "1" ? true : false}
            user_id={rows.user_id}
            fetchData={fetchData}
          />
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            width: "100px",
            gap: "1rem",
          }}
        >
          {/* Detail Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: "pointer",
              color: "#dc3545",
              height: "25px",
              width: "25px",
            }}
            viewBox="0 0 24 24"
            onClick={() => navigate("/allusers/detail", { state: { row } })}
          >
            <title>Details</title>
            <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>

          {/* Edit Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: "pointer",
              width: "20px",
              height: "20px",
              color: "#007bff", // Blue color for edit icon
            }}
            viewBox="0 0 512 512"
            onClick={() => navigate("/allusers/update", { state: { row } })} // Edit action handler
          >
            <title>Edit</title>
            <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
          </svg>

          {/*Password Icon*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: "pointer",
              width: "18px",
              height: "20px",
              color: "#dc3545", // Red color for delete icon
            }}
            viewBox="0 0 512 512"
            onClick={() =>
              navigate("/allusers/changepassword", { state: { row } })
            }
          >
            <title>Password</title>
            <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17l0 80c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24l0-40 40 0c13.3 0 24-10.7 24-24l0-40 40 0c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
          </svg>

          {/* Delete Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: "pointer",
              width: "15px",
              height: "15px",
              color: "#dc3545",
            }}
            viewBox="0 0 448 512"
            onClick={() => handleDelete(row.user_id)} // Delete action handler
          >
            <title>Delete</title>
            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </div>
      ),
    },
  ];

  const [userList, setUserList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const fetchData = async () => {
    const url = `${apiUrl}/user/getuserlist`;
    const token = localStorage.getItem("token");
    // console.log(token);
    try {
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        // console.log(res.data.data);
        setUserList(res.data.data);
        // console.log(res.data.data);

        setFilteredData(res.data.data);
      } else {
        // console.log(res.data.message);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const searchQuery = (event) => {
    const query = event.target.value.toLowerCase();
    // console.log(userList);
    const val = userList.filter((item) => {
      return (
        item.user_name.toLowerCase().includes(query) ||
        item.user_site_names.toLowerCase().includes(query)
      );
    });
    // console.log(val);

    return setFilteredData(val);
  };

  const handleDelete = async (user_id) => {
    // console.log(userList);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      const url = `${apiUrl}/user/deleteuser/${user_id}`;
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status === "success") {
          toast.success(res.data.message, {
            hideProgressBar: true,
            position: "top-right",
          });
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        } else {
          toast.error(res.data.message, {
            hideProgressBar: true,
            position: "top-right",
          });
        }
      } catch (error) {
        // console.log(error);
      }
    } else {
      toast.info("Delete action canceled.", {
        hideProgressBar: true,
        position: "top-right",
        // style: {
        //   backgroundColor: "#D4EBF8",
        //   color: "#3c6e57",
        //   fontWeight: "600",
        //   textAlign: "center",
        //   width: "100%",
        // },
      });
    }
  };

  return (
    <div className="absolute w-full h-full flex flex-col items-start">
      <div className="lg:mt-5 xl:mt-3 2xl:-mt-1">
        <BreadCrumb items={breadItems} />
      </div>
      <div className="flex-1 relative w-[98.45%]">
        {/* <Sidebar /> */}
        {/* <div className="relative">
      {localStorage.getItem("ticketPermission") == "0" && (
        <button
          type="button"
          onClick={() => navigate("/mytickets/create")}
          className="absolute lg:-top-3 lg:right-[38%] xl:right-[28%] 2xl:right-[20.5%] bg-[#4C1F7A] text-white px-4 py-[5px] rounded-md font-medium cursor-pointer z-20"
        >
          New Ticket <span className="text-lg text-white">+</span>
        </button>
      )}
    </div> */}
        <div className="h-auto bg-white border-[1px] border-black">
          <DataTable
            title="User List"
            data={filteredData}
            // data={data}
            columns={columns}
            customStyles={tableCustomStyles}
            striped
            highlightOnHover
            dense
            className="rounded-lg w-full "
            actions={
              <>
                {localStorage.getItem("ticketPermission") == "0" && (
                  <button
                    type="button"
                    onClick={() => navigate("/allusers/add")}
                    className="absolute lg:right-[38%] xl:right-[32%] 2xl:right-[21.5%] bg-[#257180] text-white px-4 py-1 rounded-md font-medium cursor-pointer z-20 text-base"
                  >
                    Add New <span className="text-lg text-white">+</span>
                  </button>
                )}
                <CiSearch
                  className="absolute z-10 cursor-pointer lg:right-[31.5%] xl:right-[27.5%] 2xl:right-[18.3%]"
                  size={30}
                />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="absolute bg-gray-200 rounded-md text-lg px-[2rem] py-1 outline-none lg:w-[35%] xl:w-[30%] 2xl:w-[20%] border-[1.8px] border-black"
                  onChange={searchQuery}
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
