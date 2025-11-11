import { ThemeProvider } from "@/Contexts/Theme";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Navbar from "./components/Header/Navbar";
import authService from "./Appwrite/auth";
import { login, logout } from "./Store/authSlice";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Header/Login.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Signup from "./components/Header/Signup.jsx";
import AuthLayout from "./components/Header/AuthLayout.jsx";


function App() {
  const [loading, setLoading] = useState(true);

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("themeMode") || "dark";
  });

  const lightTheme = () => {
    setThemeMode("light");
  };

  const darkTheme = () => {
    setThemeMode("dark");
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
    localStorage.setItem("themeMode", themeMode); // Store user's theme choice in local storage
  }, [themeMode]);

  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
    <div className="app flex flex-col min-h-screen overflow-y-hidden">
      <Navbar />
      <main className="flex justify-center flex-grow">
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="" element={<Home />} />
            <Route
              path="dashboard"
              element={
                <AuthLayout authentication>
                  <Dashboard />
                </AuthLayout>
              }
            />
            <Route
              path="login"
              element={
                <AuthLayout authentication={false}>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="signup"
              element={
                <AuthLayout authentication={false}>
                  <Signup />
                </AuthLayout>
              }
            />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
     </ThemeProvider>
  );
}

export default App;
