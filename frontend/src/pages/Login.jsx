import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [signUpInput, setSignUpInput] = useState({ name: "", email: "", password: "" });
    const [activeTab, setActiveTab] = useState("login");

    const handleChange = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignUpInput({ ...signUpInput, [name]: value });
        } else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    };

    const handleRegistration = async(type) => {
        const inputData = type === "signup" ? signUpInput : loginInput;
        console.log(inputData);
        



    }


    return (
        <div className="flex justify-center items-center min-h-screen">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter your credentials to access your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    name="email"
                                    value={loginInput.email}
                                    onChange={(e) => handleChange(e, "login")}
                                    placeholder="Enter your email" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={loginInput.password}
                                    onChange={(e) => handleChange(e, "login")}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick ={() => handleRegistration("login")} className="w-full block">Login</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account by providing your details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    name="name"
                                    value={signUpInput.name}
                                    onChange={(e) => handleChange(e, "signup")}
                                    placeholder="Enter your name" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    name="email"
                                    value={signUpInput.email}
                                    onChange={(e) => handleChange(e, "signup")}
                                    placeholder="Enter your email" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={signUpInput.password}
                                    onChange={(e) => handleChange(e, "signup")}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick ={() => handleRegistration("login")} className="w-full block">Signup</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Login;
