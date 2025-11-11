import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "@/Appwrite/auth";
import { login } from "@/Store/authSlice";
import Loader from "../Loader/Loader";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const signup = async (data) => {
    setError("");
    try {
      const account = await authService.createAccount(data);
      if (account) {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        if (userData) {
          await dispatch(login(userData));
          navigate("/dashboard");
        }
      }
      }
      catch (err) {
        let errorMessage = err.message || 'An error occurred during login.';
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
      <CardTitle className="text-xl">Sign Up</CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <form onSubmit={handleSubmit(signup)}>
      <CardContent>
        {error && <p className="text-red-500 text-xs sm:text-base text-center">{error}</p>}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your Full Name"
              {...register("name", {
                required: true,
              })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
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
              {...register("password", {
                required: true,
              })}
            />
          </div>
          <Button className="w-full">
            Create an account
          </Button>
          {/* <Button variant="outline" className="w-full">
            Sign up with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </form>
  </Card>
  );
};

export default Signup;
