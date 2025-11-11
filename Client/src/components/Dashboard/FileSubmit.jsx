import { useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx"; // For Excel files

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Query } from "appwrite";
import { useSelector } from "react-redux";
import service from "@/Appwrite/config";
import Loader from "../Loader/Loader";

const FileSubmit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useSelector((state) => state.auth.userData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function FileRead(data) {
    setError("");
    setLoading(true);
    const file = data.excelFile[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      try {
        for (const row of sheetData) {
          const student = await service.listStudents([
            Query.equal("userId", [user.$id]),
            Query.equal("studentUsername", [row.UserName]),
          ]);
          if (student.documents.length!=0) {
            continue;
          }
          await service.addStudent(row.Name, row.UserName, user.$id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        window.location.reload();
      }
    };
    reader.readAsBinaryString(file);
  }

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(FileRead)}>
      <div className="grid w-full max-w-sm items-center gap-3">
        {error && (
          <p className="text-red-500 text-sm sm:text-base text-center">
            {error}
          </p>
        )}
        <Label htmlFor="file">.xlsx/.csv file</Label>
        <Input
          className=""
          type="file"
          {...register("excelFile", {
            required: "File is required",
            validate: {
              excelFormat: (value) =>
                value[0]?.name.endsWith(".xls") ||
                value[0]?.name.endsWith(".xlsx") ||
                "Please select a .xlsx or .xls file",
            },
          })}
        />
        {errors.excelFile && (
          <p className="text-red-500 text-sm sm:text-base text-center">
            {errors.excelFile.message}
          </p>
        )}
        <Button type="submit">Upload</Button>
      </div>
    </form>
  );
};

export default FileSubmit;
