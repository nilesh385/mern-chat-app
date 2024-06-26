import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/shared/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Friends from "./components/shared/Friends";
import Groups from "./components/shared/Groups";
import { useAppSelector } from "./hooks/reduxHooks";

const App = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <div className="w-dvw h-dvh flex overflow-hidden">
      <Sidebar />
      <Routes>
        <Route path="/" element={user ? <p>Hello </p> : <HomePage />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/friends" element={<Friends />}></Route>
        <Route path="/groups" element={<Groups />}></Route>
      </Routes>
    </div>
  );
};

export default App;
