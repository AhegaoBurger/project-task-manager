// components/UserProfile.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import Image from "next/image";

export default function Component() {
  const [initData, setInitData] = useState<WebAppInitData | null>(null);
  const [user, setUser] = useState<WebAppUser | null>(null);

  useEffect(() => {
    const initWebApp = () => {
      WebApp.ready();
      WebApp.expand();
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => window.history.back());
      const initData = WebApp.initDataUnsafe;
      setInitData(initData);
      if (initData.user) {
        setUser(initData.user);
      }
    };
    initWebApp();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 max-w-md mx-auto">
      {/* Profile Content */}
      <div className="flex-1 p-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-4">
            <Avatar className="w-8 h-8 bg-green-500 text-white">
              <Image
                className="mt-4"
                width={100}
                height={100}
                src={`https://t.me/${user?.username}`}
                alt={`${user?.first_name} ${user?.last_name}`}
              />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-bold">
            {user?.first_name} {user?.last_name || ""}
          </h2>
          <p className="">{user?.username}</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card className="bg-white">
            <Button variant="ghost" className="w-full justify-between py-6">
              <span className="">Subscription</span>
              <div className="flex items-center">
                <span className=" mr-2">Free</span>
                <ChevronRight className="h-4 w-4 text-gray-400" size={20} />
              </div>
            </Button>
          </Card>

          <Card className="bg-gray-100">
            <Button variant="ghost" className="w-full justify-between py-6">
              <span className="">Settings</span>
              <ChevronRight className="h-4 w-4 text-gray-400" size={20} />
            </Button>
          </Card>

          <Card className="bg-gray-100 space-y-1">
            {["About us", "Support", "News"].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between py-6"
              >
                <span className="">{item}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" size={20} />
              </Button>
            ))}
          </Card>

          <Card className="bg-gray-100 space-y-1">
            {["Terms of use", "Privacy policy", "Payment policy"].map(
              (item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between py-6"
                >
                  <span className="">{item}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" size={20} />
                </Button>
              ),
            )}
          </Card>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center p-4 text-gray-500 text-sm">
        App version
        <br />
        v1.14.1F - v1.14.40B
      </div>
    </div>
  );
}
