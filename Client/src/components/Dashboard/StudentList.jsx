import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RefreshCcw, Search, Trash, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { query as GET_STUDENTS } from "@/Apollo/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo, useCallback } from "react";
import service from "@/Appwrite/config";
import { Query } from "appwrite";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Notif from "./Notif";

const StudentList = () => {
  const user = useSelector((state) => state.auth.userData);
  const [sort, setSort] = useState("problems");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);

  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_STUDENTS,
    {
      variables: {
        usernames: students.map((student) => student.studentUsername),
      },
      notifyOnNetworkStatusChange: true,
      skip: !students.length,
    }
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { documents } = await service.listStudents([
          Query.equal("userId", [user.$id]),
          Query.orderAsc("studentName"),
        ]);
        setStudents(documents || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (data) {
      const apiData = data.getStudents || [];
      const merged = apiData.map((apiStudent) => {
        const additionalInfo = students.find(
          (s) =>
            s.studentUsername.toLowerCase() ===
            apiStudent.studentUsername.toLowerCase()
        );
        return {
          ...apiStudent,
          ...additionalInfo,
          studentName:
            apiStudent.studentName || additionalInfo?.studentName || "N/A",
        };
      });
      setStudents(merged);
    }
  }, [data, students.length]);

  const calculatePoints = (student) => {
    return student.easy * 100 + student.medium * 200 + student.hard * 400;
  };

  const sortedData = useMemo(() => {
    const sorted = [...students];
    if (sort === "problems") {
      return sorted.sort((a, b) => b.all - a.all);
    } else if (sort === "name") {
      return sorted.sort((a, b) =>
        (a.studentName || "").localeCompare(b.studentName || "")
      );
    }
    else if (sort === "points") {
      return sorted.sort((a, b) => calculatePoints(b) - calculatePoints(a));
    }
    return sorted;
  }, [students, sort]);

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase();
    return sortedData.filter((student) => {
      const studentName = student.studentName || "";
      return (
        studentName.toLowerCase().includes(searchLower) ||
        student.studentUsername.toLowerCase().includes(searchLower)
      );
    });
  }, [sortedData, search]);

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSort(value);
  }, []);

  const handleDeleteClick = (documentId) => {
    service
      .deleteStudent(documentId)
      .then(() => {
        setStudents(students.filter((s) => s.$id !== documentId));
      })
      .catch((err) => console.error("Failed to delete student:", err));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16); // Increase the font size for the title
    const userName = user.name + " Sorted By : " + sort;
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(userName);
    doc.text(userName, (pageWidth - textWidth) / 2, 10); // Center the title

    // Define table columns
    const tableColumn = [
      { header: "Student Name", dataKey: "studentName" },
      { header: "Student Username", dataKey: "studentUsername" },
      { header: "Problems", dataKey: "all" },
      { header: "Easy", dataKey: "easy" },
      { header: "Medium", dataKey: "medium" },
      { header: "Hard", dataKey: "hard" },
      { header: "Points", dataKey: "points" },
    ];

    // Prepare table rows
    const tableRows = filteredData.map((student) => ({
      studentName: student.studentName,
      studentUsername: student.studentUsername,
      all: student.all,
      easy: student.easy,
      medium: student.medium,
      hard: student.hard,
      points: calculatePoints(student),
    }));

    // Generate the table in the PDF
    doc.autoTable({
      head: [tableColumn.map((col) => col.header)],
      body: tableRows.map((row) => tableColumn.map((col) => row[col.dataKey])),
      startY: 20,
      headStyles: {
        halign: "center",
        valign: "middle",
        fontSize: 14,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        fontSize: 12,
      },
    });

    doc.save(`${user.name}-student-list.pdf`);
  };

  return (
    <>
      <div className="flex w-full items-center flex-wrap sm:space-x-3 sm:space-y-0 space-y-2 justify-around sm:justify-start">
        <div className="flex w-11/12 sm:w-auto items-center justify-center space-x-2">
          <Notif/>
          <Search className="w-4 h-4 sm:h-6 sm:w-6" />
          <Input
            className="text-xs sm:text-base sm:p-4 p-2 lg:w-[250px] w-full"
            type="text"
            placeholder="Search By Name or Username"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs sm:text-base text-center">Sort By:</div>
          <Select onValueChange={handleSortChange} defaultValue="problems">
            <SelectTrigger className="text-xs sm:text-base sm:p-4 p-2 sm:w-[120px] w-[90px]">
              <SelectValue placeholder="Problems" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="problems">Problems</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="points">Points</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 sm:h-6 sm:w-6" />
          </Button>
          <Button
            disabled={!filteredData.length || loading || networkStatus === 4}
            variant="outline"
            className="text-xs sm:text-base sm:p-4 p-2"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 mr-2 h-4 sm:h-6 sm:w-6" />
            Download
          </Button>
        </div>
      </div>
      {loading || networkStatus === 4 ? (
        <div className="text-center text-6xl">...Loading</div>
      ) : error ? (
        <div className="text-red-500 text-center text-3xl">
          Error: {error.message}
        </div>
      ) : !filteredData.length ? (
        <div className="space-y-4">
          <div className="text-center text-5xl">No Students Found</div>
          <div className="text-center text-3xl">
            Open "Add Students Data" menu from Sidebar to add students .
          </div>
        </div>
      ) : (
        <div className="flex border rounded-md flex-col sm:h-[72vh] h-[66vh]">
          <Table>
            <TableHeader>
              <TableRow className="text-xs sm:text-base">
                <TableHead className="text-center">Student Name</TableHead>
                <TableHead className="text-center">Student Username</TableHead>
                <TableHead className="text-center">Problems</TableHead>
                <TableHead className="text-center">Easy</TableHead>
                <TableHead className="text-center">Medium</TableHead>
                <TableHead className="text-center">Hard</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow
                  key={student.studentUsername}
                  className="text-center text-xs sm:text-base"
                >
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell className="underline-offset-2 underline">
                    <a
                      href={`https://www.leetcode.com/u/${student.studentUsername}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {student.studentUsername}
                    </a>
                  </TableCell>
                  <TableCell>{student.all}</TableCell>
                  <TableCell className="text-green-500">
                    {student.easy}
                  </TableCell>
                  <TableCell className="text-yellow-500">
                    {student.medium}
                  </TableCell>
                  <TableCell className="text-red-500">{student.hard}</TableCell>
                  <TableCell className="text-blue-500">
                    {calculatePoints(student)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteClick(student.$id)}
                      >
                        <Trash className="w-4 h-4 sm:h-6 sm:w-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default StudentList;
