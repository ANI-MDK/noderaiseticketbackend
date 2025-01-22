import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import bgImage from "../assets/bg.jpg";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { GoogleReCaptchaProvider, GoogleReCaptcha }  from 'react-google-recaptcha-v3';


const Login = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [type, setType] = useState(false);
  const [token1, setToken1] = useState('');

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToken = (getToken) =>{
    setToken1(getToken);
}

  const submitHandler = async (e) => {
    e.preventDefault();

    if(!token1) {
      //console.log("Error please check");
      return;
    }
    // Basic validation (optional if you want additional checks)
    // if (!formData.username || !formData.password) {
    //   toast.error("Please enter both username and password", {
    //     hideProgressBar: true,
    //     position: "top-right",
    //   });
    //   return;
    // }

    //console.log(token1);

    const url = `${apiUrl}/login/auth`;
    try {
      const res = await axios.post(url, {
        username: formData.username,
        password: formData.password,
        token:token1,
      });

      const token = res.headers.authorization;

      if (res.data.status === "success") {
        // Save data to localStorage
        // console.log(res.data.data);
        // console.log(apiUrl);
        
        localStorage.setItem("ticketPermission", res.data.data.user_can_raise_new_ticket);
        localStorage.setItem("track_site_tickets", res.data.data.user_can_track_site_tickets);
        localStorage.setItem("track_department_tickets", res.data.data.user_can_track_department_tickets);
        localStorage.setItem("permission", res.data.data.is_admin_user);
        localStorage.setItem("user_name", res.data.data.user_name);
        localStorage.setItem("associatedSites", JSON.stringify(res.data.data.associatedSite));
        localStorage.setItem("is_department_assigner", res.data.data.is_department_assigner);
        localStorage.setItem("user_department_name", res.data.data.user_department_name);
        localStorage.setItem("user_department_id", res.data.data.user_department_id);
        localStorage.setItem("token", token);

        // Navigate to home page
        window.location.reload(navigate("/home"));
        // navigate("/home");
      } else {
        toast.error(res.data.message, {
          hideProgressBar: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.", {
        hideProgressBar: true,
        position: "top-right",
      });
    }
    // navigate("/home");
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Lc2H74qAAAAAM-7GAc8UsLADWgTqDq9fyiteh7B">
      <GoogleReCaptcha className="google-recaptcha-custom-class" onVerify={handleToken}/>
      <div
        className="h-screen w-full flex justify-center items-center fixed top-0 left-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <form
          onSubmit={submitHandler}
          className="h-auto md:w-[40vw] lg:w-[35vw] xl:w-[30vw] 2xl:w-[25vw] bg-white items-center md:px-5 md:py-8 lg:px-5 lg:py-8 xl:px-5 xl:py-8 rounded-lg shadow-lg"
        >
          {/* Title Section */}
          <div className="text-center mb-6 -mt-4">
            <p className="text-slate-900 text-2xl font-mono">
              Welcome To <span className="text-red-600 text-2xl">Raise Ticket App</span>
            </p>
          </div>

          {/* Username Input */}
          <div className="w-full mb-2 flex flex-col">
            <p className="text-red-600 text-lg mb-0 mx-1">Username</p>
            <input
              className="rounded-lg p-2 bg-slate-200 font-medium w-full"
              type="email"
              required
              name="username"
              value={formData.username}
              onChange={onChangeHandler}
              placeholder="Enter your email id..."
            />
          </div>

          {/* Password Input */}
          <div className="w-full mb-2 flex flex-col relative z-10">
            <p className="text-red-600 text-lg mb-0 mx-1">Password</p>
            <input
              className="rounded-lg p-2 bg-slate-200 font-medium w-full"
              type={type ? "text" : "password"}
              required
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              placeholder="Enter your password..."
            />
            {type === false ? (
              <FaRegEyeSlash
                onClick={() => setType((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "20px",
                  zIndex: "20",
                  bottom: "12px",
                  cursor: "pointer",
                  animation: "ease-in-out",
                }}
              />
            ) : (
              <FaRegEye
                onClick={() => setType((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "20px",
                  zIndex: "20",
                  bottom: "12px",
                  cursor: "pointer",
                  animation: "ease-in-out",
                }}
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full mt-12">
            <button
              type="submit"
              className="w-full py-2 bg-red-700 hover:bg-red-600 text-white text-xl font-medium rounded-lg shadow-lg"
            >
            Login
            </button>
          </div>
        </form>
        <ToastContainer/>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default Login;
