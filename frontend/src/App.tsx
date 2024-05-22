import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/shared/Sidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Friends from "./components/shared/Friends";
import Groups from "./components/shared/Groups";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/friends" element={<Friends />}></Route>
          <Route path="/groups" element={<Groups />}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
