import DarkLight from "./DarkLight";
import dark from "../../assets/dark.png";
import light from "../../assets/light.png";
import Form from "../Dashboard/Form";
import LogoutBtn from "./LogoutBtn";
import LoginBtn from "./LoginBtn";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import useTheme from "@/Contexts/Theme";

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  // console.log(pathname)

  const {themeMode,} = useTheme();
  
  const authStatus = useSelector((state) => state.auth.status);

  return (
      <div className="w-full flex sm:justify-between justify-between items-center px-4 py-4 left-0 right-0 top-0">
        <div className="flex sm:space-x-4 items-center">
        {authStatus && pathname == "/dashboard" && <Form />}
        <Link to="/" className="flex">
          <img src={themeMode === "dark" ? dark : light} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12" />
          <h2 className="text-center scroll-m-20 border-b text-2xl sm:text-4xl font-semibold tracking-tight">
            LeetStats
          </h2>
        </Link>
        </div>
        <div className="flex items-center space-x-1">
          <DarkLight />
          {authStatus && pathname != "/dashboard" && (
            <Link to="/dashboard">
              <Button
                variant=""
                className="text-xs p-1 sm:p-4 sm:text-base"
              >
                DashBoard
              </Button>
            </Link>
          )}
          {!authStatus && <LoginBtn />}
          {authStatus && <LogoutBtn />}
        </div>
      </div>
   
  );
};

export default Navbar;
