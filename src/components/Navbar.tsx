"use client";

import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation";

function Navbar({ className }: { className?: string }) {
  const router = useRouter()
  const [active, setActive] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const getUserDetails = async () => {
    const res = await axios.post("/api/users/me");
    console.log(res.data, "abhishek");
    setData(res.data.data._id);
  };

  const logout = async () => {
    try {
        await axios.get('/api/users/logout')
        toast.success('Logout successful')
        router.push('/login');
    } catch (error:any) {
        console.log(error.message);
        toast.error(error.message);
    }
}


  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 ",
        className
      )}
    >
      <Menu setActive={setActive}>
        <Link href={"/"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
          ></MenuItem>
        </Link>
        <MenuItem setActive={setActive} active={active} item="Our Courses">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/courses">All Courses</HoveredLink>
            <HoveredLink href="/courses">Basic Music Theory</HoveredLink>
            <HoveredLink href="/courses">Advanced Composition</HoveredLink>
            <HoveredLink href="/courses">Songwriting</HoveredLink>
            <HoveredLink href="/courses">Music Production</HoveredLink>
          </div>
        </MenuItem>
        <Link href={"/contact"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Contact Us"
          ></MenuItem>
        </Link>
        {!data ? (
          <>
            <Link href={"/login"}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Login"
              ></MenuItem>
            </Link>
            <Link href={"/signup"}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Signup"
              ></MenuItem>
            </Link>
          </>
        ) : (
          <>
            <button onClick={logout}>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Logout"
              ></MenuItem>
            </button>
          </>
        )}
      </Menu>
    </div>
  );
}

export default Navbar;
