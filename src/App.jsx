import "./App.css";
import { Outlet } from "react-router-dom";
import Footer from "./HOC/Footer";
import Header from "./HOC/Header";
import AuthContext from "./context/auth-context";
import { useEffect, useState } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [category, setCategory] = useState([]);
  const [interest, setInterests] = useState([]);
  const [blocked, setBlocked] = useState([]);
  useEffect(() => {
    if (document.cookie) {
      setAuthenticated(true);
    }
  }, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          authenticated,
          setAuthenticated,
          user,
          setUser,
          category,
          setCategory,
          interest,
          setInterests,
          blocked,
          setBlocked,
        }}
      >
        <Header />
        <Outlet />
        <Footer />
      </AuthContext.Provider>
    </>
  );
}

export default App;
