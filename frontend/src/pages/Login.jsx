import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginUserMutation, useRegisterUserMutation } from "@/store/api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {login} from "../store/slices/authSlice"

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signUpInput, setSignUpInput] = useState({ name: "", email: "", password: "" });
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignUpInput({ ...signUpInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signUpInput : loginInput;

    try {
      if (type === "signup") {
        await registerUser(inputData).unwrap();
        toast.success("Registration successful!");
        setActiveTab("login");
        setSignUpInput({ name: "", email: "", password: "" });
      } else {
        const res = await loginUser(inputData).unwrap();
        if (res && res.user) {
          dispatch(login(res.user));
          localStorage.setItem("user", JSON.stringify(res.user));
          toast.success("Login successful!");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => handleChange(e, "login")}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => handleChange(e, "login")}
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegistration("login")}
                disabled={isLoginLoading}
                className="w-full"
              >
                {isLoginLoading ? "Logging In..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={signUpInput.name}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={signUpInput.email}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={signUpInput.password}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Create a password"
                  type="password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegistration("signup")}
                disabled={isRegisterLoading}
                className="w-full"
              >
                {isRegisterLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;