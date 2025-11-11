import useTheme from "@/Contexts/Theme";
import datadark from "./Screenshots/datadark.png";
import datalight from "./Screenshots/datalight.png";
import logindark from "./Screenshots/logindark.png";
import signupdark from "./Screenshots/signupdark.png";
import loginlight from "./Screenshots/loginlight.png";
import signuplight from "./Screenshots/signuplight.png";
import statsdark from "./Screenshots/statsdark.png";
import statslight from "./Screenshots/statslight.png";
import { useMemo } from "react";

const Features = () => {
  const { themeMode } = useTheme();

  const feat = useMemo(() => [
    {
      title: "Signup",
      img: themeMode === "dark" ? signupdark : signuplight,
      desc: "Create an account to start your journey with us and unlock all features.",
    },
    {
      title: "Login",
      img: themeMode === "dark" ? logindark : loginlight,
      desc: "Access your account to track your students' progress.",
    },
    {
      title: "Add Students to Track",
      img: themeMode === "dark" ? datadark : datalight,
      desc: "Easily add students to your account and keep track of their progress. Whether it is an excel file with the student's name and LeetCode username in it, or you want to add it manually.",
    },
    {
      title: "Dashboard",
      img: themeMode === "dark" ? statsdark : statslight,
      desc: "View your students' progress and manage your account. Sort the data and search. Download it as a PDF file. Added features like Dark/Light Mode and a refetch option to get the latest stats at a click of a button!",
    },
  ], [themeMode]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {feat.map(({ title, img, desc }, index) => (
        <div key={index} className="rounded-lg shadow-sm shadow-foreground">
          <img src={img} alt={`Screenshot of ${title}`} loading="lazy" className="w-full object-contain" />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
