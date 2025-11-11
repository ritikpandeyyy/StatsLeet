import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const LoginBtn = () => {
  return (
    <div className="space-x-2">
      <Link to="/login">
        <Button className="p-1 sm:p-4 text-xs sm:text-base">Login</Button>
      </Link>
      <Link to='/signup'>
        <Button className="p-1 sm:p-4 text-xs sm:text-base">Sign Up</Button>
      </Link>
    </div>
  );
};

export default LoginBtn;
