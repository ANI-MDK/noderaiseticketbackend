import { useState } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import Sidebar from "../Sidebar/Sidebar";

const Content = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      description: "Laptop freezing",
      ticketrequest: "16/11/2024",
      ticketresolved: "17/11/2024",
      resolved: 1,
    },
    {
      id: 2,
      name: "Jane Smith",
      description: "Laptop not working",
      ticketrequest: "17/11/2024",
      ticketresolved: "20/11/2024",
      resolved: 3,
    },
    {
      id: 3,
      name: "Samuel Adams",
      description: "WiFi not working",
      ticketrequest: "18/11/2024",
      ticketresolved: "19/11/2024",
      resolved: 1,
    },
    {
      id: 4,
      name: "Nancy Allen",
      description: "Laptop freezing",
      ticketrequest: "22/11/2024",
      ticketresolved: "01/12/2024",
      resolved: 8,
    },
    {
      id: 5,
      name: "Michael Green",
      description: "WiFi not working",
      ticketrequest: "28/11/2024",
      ticketresolved: "04/11/2024",
      resolved: 6,
    },
    {
      id: 6,
      name: "Sarah Brown",
      description: "Laptop freezing",
      ticketrequest: "21/11/2024",
      ticketresolved: "22/11/2024",
      resolved: 1,
    },
    {
      id: 7,
      name: "John Doe",
      description: "Laptop freezing",
      ticketrequest: "16/11/2024",
      ticketresolved: "17/11/2024",
      resolved: 1,
    },
    {
      id: 8,
      name: "Jane Smith",
      description: "Laptop not working",
      ticketrequest: "17/11/2024",
      ticketresolved: "20/11/2024",
      resolved: 3,
    },
    {
      id: 9,
      name: "Samuel Adams",
      description: "WiFi not working",
      ticketrequest: "18/11/2024",
      ticketresolved: "19/11/2024",
      resolved: 1,
    },
    {
      id: 10,
      name: "Nancy Allen",
      description: "Laptop freezing",
      ticketrequest: "22/11/2024",
      ticketresolved: "01/12/2024",
      resolved: 8,
    },
    {
      id: 11,
      name: "Michael Green",
      description: "WiFi not working",
      ticketrequest: "28/11/2024",
      ticketresolved: "04/11/2024",
      resolved: 6,
    },
    {
      id: 12,
      name: "Sarah Brown",
      description: "Laptop freezing",
      ticketrequest: "21/11/2024",
      ticketresolved: "22/11/2024",
      resolved: 1,
    },
  ];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "25%",
      style: {
        textAlign: "right",
      },
    },
    {
      name: "Ticket Request",
      selector: (row) => row.ticketrequest,
      sortable: true,
      width: "20%",
    },
    {
      name: "Ticket Resolved",
      selector: (row) => row.ticketresolved,
      sortable: true,
      width: "20% xl:16%",
    },
    {
      name: "Resolved(days)",
      selector: (row) => row.resolved,
      sortable: true,
      width: "20% xl:16%",
    },
  ];

  const [filterData, setFilteredData] = useState(data);
  const searchQuery = (event) => {
    const query = event.target.value.toUpperCase();
    const val = data.filter((item) => {
      return item.name.toUpperCase().includes(query);
    });

    return setFilteredData(val);
  };

  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "normal",
        backgroundColor: "#000",
        justifyContent: "start",
        alignItems: "center",
        color: "#fff",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        justifyContent: "start",
        alignItems: "center",
      },
    },
  };

  return (
    <div className="flex-1 lg:w-[70vw] xl:w-[70vw] 2xl:w-[80vw] max-w-full flex flex-col p-4 bg-slate-200 mx-auto mb-[5%] relative overflow-y-hidden">
      <Sidebar/>
      {/* Table Section */}
      <input
        type="search"
        placeholder="Search here..."
        className="absolute px-10 lg:py-1 xl:py-1 lg:w-[30%] xl:w-[20%] top-10 right-10 z-10 border-[1px] border-black bg-gray-200 rounded-xl text-lg"
        onChange={searchQuery}
      />
      <CiSearch
        className="absolute z-10 lg:top-10 xl:top-11 lg:right-[30%] xl:right-[20%] cursor-pointer"
        size={35}
      />
      <div className="w-full rounded-sm shadow-lg mb-3 bg-white">
        <DataTable
          title="Ticket List"
          data={filterData}
          columns={columns}
          customStyles={tableCustomStyles}
          striped
          highlightOnHover
          pagination
          className="rounded-lg w-full"
        />
      </div>

      {/* Info Cards - Total Balance, Total Revenue, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-white rounded-sm shadow-md p-4">
          <h3 className="text-gray-500 text-lg">{`Total Tickets (this month)`}</h3>
          <hr className="my-2" />
          <p className="text-center text-lg font-medium">142+</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-sm shadow-md p-4">
          <h3 className="text-gray-500 text-lg">{`Total Tickets Resolved (this month)`}</h3>
          <hr className="my-2" />
          <p className="text-center text-lg font-medium">78</p>
        </div>

        {/* This Month Total P&L */}
        <div className="bg-white rounded-sm shadow-md p-4">
          <h3 className="text-gray-500 text-lg">Unresolved Tickets</h3>
          <hr className="my-2" />
          <p className="text-center text-lg font-medium">52</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-sm shadow-md p-4">
          <h3 className="text-gray-500 text-lg">Tickets In-progress</h3>
          <hr className="my-2" />
          <p className="text-center text-lg font-medium">10</p>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="bg-white rounded-sm shadow-lg p-4 mt-3">
        <h3 className="text-gray-500 text-lg">Tickets Status</h3>
        <hr className="my-2" />
        <p className="text-center">here will be graph of tickets</p>
      </div>
    </div>
  );
};

export default Content;
