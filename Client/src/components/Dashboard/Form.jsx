import { useState } from "react";
/* eslint-disable no-unused-vars */
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import service from "@/Appwrite/config";
import FileSubmit from "../Dashboard/FileSubmit";
import { Query } from "appwrite";

const Form = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      studentNames: "",
      userNames: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitStudent = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const names = data.studentNames.split(",").map((name) => name.trim());
      const usernames = data.userNames
        .split(",")
        .map((username) => username.trim());

      if (names.length !== usernames.length) {
        setError("The number of names and usernames must match.");
        setLoading(false);
        return;
      }

      for (let i = 0; i < names.length; i++) {
        const student = await service.listStudents([
          Query.equal("userId", [userData.$id]),
          Query.equal("studentUsername", [usernames[i]]),
        ]);
        if (student.documents.length !== 0) {
          setError(`Student with username ${usernames[i]} already exists.`);
          setLoading(false);
          return;
        }
        await service.addStudent(names[i], usernames[i], userData.$id);
      }

      setSuccess("Students added successfully.");
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-4 h-4 sm:h-6 sm:w-6" />
      </SheetTrigger>
      <SheetContent side="left">
        <Card className="my-6 w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-2xl">
              Add Students Data
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add from an excel file which contains names and usernames of
              students or enter manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileSubmit />
          </CardContent>
          <h1 className="flex justify-center">OR</h1>
          <CardContent>
            {error && (
              <p className="text-red-500 text-sm sm:text-base text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 text-sm sm:text-base text-center">
                {success}
              </p>
            )}
            <form
              onSubmit={handleSubmit(submitStudent)}
              className="grid w-full max-w-sm items-center gap-3"
            >
              <Label htmlFor="studentNames">Names (comma separated)</Label>
              <Input
                type="text"
                id="studentNames"
                placeholder="Name1, Name2, ..."
                {...register("studentNames", { required: true })}
              />
              <Label htmlFor="userNames">Usernames (comma separated)</Label>
              <Input
                type="text"
                id="userNames"
                placeholder="Username1, Username2, ..."
                {...register("userNames", { required: true })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default Form;
