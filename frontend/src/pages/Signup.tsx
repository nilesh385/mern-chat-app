import { Link } from "react-router-dom";
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
import { z } from "zod";
export default function LoginForm() {
  const SignupSchema = z.object({
    fullname: z.string(),
    profilePhoto: z.string().optional(),
    username: z.string(),
    email: z.string().email({ message: "Email must be a valid email address" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().optional(),
  });
  return (
    <div className=" w-full flex justify-center items-center">
      <Card className="mx-auto max-w-lg my-10">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={() => {}} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Fullname</Label>
              <Input id="fullname" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="picture">Profile Photo</Label>
              <Input id="picture" type="file" className=" cursor-pointer" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johndoe123" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/Login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
