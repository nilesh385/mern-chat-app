import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Card className=" w-full h-full">
      <div className=" w-full flex justify-between items-center px-4">
        <div className="flex size-12 cursor-pointer">
          <img src="/chat.png" alt="logo img" />
        </div>

        <CardHeader className="w-full flex items-center">
          <CardTitle className="text-3xl font-bold">Chat-App</CardTitle>
          <CardDescription>
            A chat-application created for chatting with your friends.
          </CardDescription>
        </CardHeader>

        <div className="flex gap-3">
          <Link to={"/signup"}>
            <Button>Signup</Button>
          </Link>
          <Link to={"/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      </div>
      <CardContent></CardContent>
    </Card>
  );
};

export default HomePage;
