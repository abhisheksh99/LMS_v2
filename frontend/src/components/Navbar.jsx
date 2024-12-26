import React, { useEffect, useState } from "react";
import { Menu, School } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "../components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import { useLogoutUserMutation } from "@/store/api/authApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser, { isError, data, isSuccess }] = useLogoutUserMutation();

  const [toastShown, setToastShown] = useState(false); 

  useEffect(() => {
    if (isSuccess && !toastShown) {
      setToastShown(true); 
      toast.success(data?.message || "User logged out successfully.");
      dispatch(logout());
      localStorage.removeItem("user");
      navigate("/login");
    }
    if (isError && !toastShown) {
      setToastShown(true);
      toast.error("Failed to log out. Please try again.");
    }
  }, [isSuccess, isError, data, toastShown, dispatch, navigate]);

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
    } catch (err) {
      toast.error("An error occurred during logout.");
    } finally {
      setToastShown(false); 
    }
  };
  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user.photoUrl || "https://github.com/shadcn.png"}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role === "Instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/login">
                <Button>Signup</Button>
              </Link>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>
        <MobileNavbar user={user} onLogout={logoutHandler} />
      </div>
    </div>
  );
};

const MobileNavbar = ({ user, onLogout }) => {
  const role = user?.role || "Student";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <Link to="/">E-Learning</Link>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="my-2" />
        <nav className="flex flex-col space-y-4">
          {user ? (
            <>
              <Link to="/my-learning">My Learning</Link>
              <Link to="/profile">Edit Profile</Link>
              <p className="cursor-pointer text-red-600" onClick={onLogout}>
                Logout
              </p>
              {role === "Instructor" && (
                <Link to="/admin/dashboard" className="text-blue-600">
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;