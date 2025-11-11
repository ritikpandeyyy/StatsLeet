import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "@/Appwrite/auth";
import { useForm } from "react-hook-form";
import { login as storeLogin } from "@/Store/authSlice";
import Loader from "../Loader/Loader";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    try {
      const user = await authService.login(data);
      if (user) {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        if (userData) {
          await dispatch(storeLogin(userData));
          navigate("/dashboard");
        }
      }
    } catch (err) {
      let errorMessage = err.message || 'An error occurred during login.';
      if (errorMessage.includes('Invalid credentials. Please check the email and password.')) {
        errorMessage = 'Invalid credentials. Please check the email and password or create a new account.';
      }
      if (errorMessage.includes('in this project')) {
        errorMessage = errorMessage.replace(' in this project', '');
      }
      setError(errorMessage);
    }
    finally{
      setLoading(false);
    }
  };
  return (
    loading ? <Loader/> :
    <Card className="mx-7 sm:mx-auto sm:w-4/12 self-center">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(login)}>
        <CardContent className="grid gap-4">
        {error && <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                    "Invalid email address",
                },
              })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card> 
  );
};

export default Login;
