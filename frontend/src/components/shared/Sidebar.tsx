import { Home } from "lucide-react";
import { Card } from "../ui/card";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { FaUserFriends } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { Button } from "../ui/button";

const Sidebar = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <Card className=" h-full px-2 py-4 flex flex-col justify-between">
      <div className="flex flex-col gap-12">
        <Link to={"/"}>
          <Button
            className="p-2"
            variant={pathname === "/" ? "default" : "outline"}
          >
            <Home />
          </Button>
        </Link>
        <Link to={"/friends"}>
          <Button
            className="p-2"
            variant={pathname === "/friends" ? "default" : "outline"}
          >
            <FaUserFriends size={24} />
          </Button>
        </Link>
        <Link to={"/groups"}>
          <Button
            className="p-2"
            variant={pathname === "/groups" ? "default" : "outline"}
          >
            <MdGroups size={24} />
          </Button>
        </Link>
      </div>
      <ModeToggle />
    </Card>
  );
};

export default Sidebar;
