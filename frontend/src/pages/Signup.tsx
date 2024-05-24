import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import useImageToBase64 from "@/hooks/useImageToBase64";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setUser } from "@/redux/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Define your validation schema with Zod
const signupSchema = z.object({
  fullname: z.string(),
  profilePhoto: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  confirmPassword: z.string(),
});

interface FormData {
  fullname: string;
  profilePhoto?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export default function Signup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { base64String, imgUrl, setBase64String, setImgUrl } =
    useImageToBase64(inputRef); // Use the hook
  const form = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      profilePhoto: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetSelection = () => {
    setBase64String(null);
    setImgUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  async function onSubmit(data: FormData) {
    if (loading) return;
    if (data.confirmPassword !== data.password) {
      toast.error("Passwords do not match");
      return;
    }
    data.profilePhoto = base64String || undefined;
    delete data.confirmPassword;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await res.json();
      if (userData.error) {
        return toast.error(userData.error);
      }
      // console.log(userData.user);
      dispatch(setUser(userData.user));
      localStorage.setItem("user", JSON.stringify(userData.user));
      toast.success(userData.message);
      navigate("/");
    } catch (error: any) {
      return toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full  overflow-y-auto">
      <div className=" w-full flex justify-center items-center ">
        <Card className="mx-auto w-full md:max-w-sm my-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <hr className="h-[2px] w-full mb-2  bg-gray-500" />
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full grid gap-2"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <Input
                          className=" cursor-pointer"
                          type="file"
                          accept="image/*"
                          {...field}
                          ref={inputRef}
                        />
                      </FormControl>
                      {imgUrl && (
                        <div className=" max-h-32 max-w-32 relative ">
                          <img
                            src={URL.createObjectURL(imgUrl)}
                            alt="Preview"
                            className="size-28"
                          />
                          <Button
                            className="absolute top-0 right-0 rounded-full p-1 size-6"
                            variant={"outline"}
                          >
                            <X onClick={resetSelection} />
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="flex w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...field}
                          />
                          <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  Sign Up
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/Login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
