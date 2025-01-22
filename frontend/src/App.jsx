import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import {
  Login,
  AllRoles,
  AddRole,
  EditRole,
  AllSite,
  AddSite,
  EditSite,
  AddUser,
  AllUsers,
  EditUser,
  AddDepartment,
  AllDepartments,
  EditDepartment,
  UserPass,
  AssignDepartment,
  Dashboard,
  Header,
  Footer,
  AddTicket,
  // Tickets,
  Details,
  ToastContainer,
  Sidebar,
} from "./Index.js";
import UserDetail from "./User/UserDetail.jsx";
import MyTickets from "./Tickets/MyTickets.jsx";
// import TicketDetail from "./Tickets/TicketDetail.jsx";
import AssignedTickets from "./Tickets/AssignedTickets.jsx";
import AssignedTicketDetail from "./Tickets/AssignedTicketDetail.jsx";
import OtherTickets from "./Tickets/OtherTickets.jsx";
import OtherTicketsDetail from "./Tickets/OtherTicketsDetail.jsx";
import SiteGeneratedTickets from "./Tickets/SiteGeneratedTickets.jsx";
import SiteGeneratedTicketsDetail from "./Tickets/SiteGeneratedTicketsDetail.jsx";


// Layout component that includes header, footer, and a main content area
const Layout = () => (
  <div className="bg-slate-100 relative min-h-screen w-full flex flex-col overflow-hidden">
    <Header />
      <Sidebar />
      <main className="flex-grow overflow-y-auto overflow-x-hidden absolute h-[84%] right-0 md:w-full lg:w-[77%] xl:w-[79.5%] 2xl:w-[85%] mt-[4.5%]">
        <Outlet />
      </main>
    <Footer />
  </div>
);

const App = () => {
  const token = localStorage.getItem("token");
  const userPermission = localStorage.getItem("permission");

  // If there is no token, user should be redirected to login
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen w-full flex overflow-y-auto relative">
      <ToastContainer />
      <Routes>
        {/* Public route */}
        {/* <Route path="/" element={!token ? <Login/> : <Navigate to="/home"/>}/> */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route element={<Layout />}>
          {userPermission === "1" ? (
            //Admin routes
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mytickets" element={<MyTickets />} />
              <Route path="/mytickets/create" element={<AddTicket />} />
              <Route path="/mytickets/detail" element={<Details />} />
              {/* <Route path="/mytickets/detail" element={<TicketDetail />} /> */}
              {/* <Route path="/allTickets" element={<Tickets />} /> */}
              <Route path="/allroles" element={<AllRoles />} />
              <Route path="/allroles/add" element={<AddRole />} />
              <Route path="/allroles/update" element={<EditRole />} />
              <Route path="/allsites" element={<AllSite />} />
              <Route path="/allsites/add" element={<AddSite />} />
              <Route path="/allsites/update" element={<EditSite />} />
              <Route path="/allusers" element={<AllUsers />} />
              <Route path="/allusers/add" element={<AddUser />} />
              <Route path="/allusers/update" element={<EditUser />} />
              <Route path="/allusers/detail" element={<UserDetail />} />
              <Route path="/allusers/changepassword" element={<UserPass />} />
              <Route path="/alldepartments" element={<AllDepartments />} />
              <Route path="/alldepartments/add" element={<AddDepartment />} />
              <Route
                path="/alldepartments/update"
                element={<EditDepartment />}
              />
              <Route
                path="/alldepartments/assign"
                element={<AssignDepartment />}
              />
            </>
          ) : (
            // User routes
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mytickets" element={<MyTickets />} />
              <Route path="/assignedtickets" element={<AssignedTickets/>}/>
              <Route path="/assignedtickets/detail" element={<AssignedTicketDetail/>}/>
              <Route path="/othertickets" element={<OtherTickets/>}/>
              <Route path="/othertickets/otherticketsdetail" element={<OtherTicketsDetail/>}/>
              <Route path="/sitegeneratedtickets" element={<SiteGeneratedTickets/>}/>
              <Route path="/sitegeneratedtickets/sitegeneratedticketsdetail" element={<SiteGeneratedTicketsDetail/>}/>
              {/* <Route path="/allTickets" element={<Tickets />} /> */}
              <Route path="/mytickets/create" element={<AddTicket />} />
              {/* <Route path="/mytickets/detail" element={<TicketDetail />} /> */}
              <Route path="/mytickets/detail" element={<Details />} />
            </>
          )}
        </Route>

        {/* Redirect if no matching route */}
        <Route
          path="*"
          element={!token ? <Navigate to="/" /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </div>
  );
};

export default App;
