"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      if (response.data.success) {
        console.log(response.data, "login success");
        router.push("/profile");
      }
      setLoading(false);
    } catch (error: any) {
      console.log("login failed");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex justify-center items-center h-[120vh]">
      <BackgroundGradient className="flex flex-col rounded-[22px] bg-white p-10 dark:bg-zinc-900 overflow-hidden h-full max-w-sm items-center">
        <h1 className="mb-auto pb-10 text-ellipsis font-bold">
          {loading ? "Processing" : "login"}
        </h1>
        <hr />
        <div className="flex flex-col gap-3 pt-[15px]">
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            placeholder="email"
            className="rounded-[8px] px-2 py-4 h-[30px] text-blue-600"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.currentTarget.value });
            }}
          />
        </div>
        <div className="flex mb-10 flex-col gap-3 pt-[15px]">
          <label htmlFor="password">password</label>
          <input
            type="text"
            id="password"
            placeholder="password"
            className="rounded-[8px] px-2 py-4 h-[30px] text-blue-600"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.currentTarget.value });
            }}
          />
        </div>
        <BackgroundGradient className="rounded-[2px] cursor-pointer">
          <button onClick={onLogin} className="py-2 px-5 h-full cursor-pointer">
            {buttonDisabled ? "No login" : "login"}
          </button>
        </BackgroundGradient>
      </BackgroundGradient>
    </div>
  );
};

export default Page;
