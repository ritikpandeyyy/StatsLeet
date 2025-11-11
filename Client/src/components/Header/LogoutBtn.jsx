import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import authService  from "@/Appwrite/auth";
import { logout } from "@/Store/authSlice";
import { Button } from "../ui/button";
import Loader from '../Loader/Loader';

const LogoutBtn = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (loading) return <Loader />;
  const logoutHandler = async () => {
    setLoading(true);
    await authService.logout().then(() => {
      dispatch(logout());
    });
    setLoading(false);
    navigate("/");
  };
  return <Button onClick={logoutHandler} className="text-xs p-1 sm:p-4 min sm:text-base" variant="destructive">Logout</Button>;
};

export default LogoutBtn;
