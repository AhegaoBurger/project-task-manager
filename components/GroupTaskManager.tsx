"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Calendar,
  RotateCcw,
  Flag,
  Users,
  Paperclip,
  Plus,
} from "lucide-react";

export default function GroupTaskManager() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">UTasks | Task Manager</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Group Avatar" />
              <AvatarFallback>SG</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Sibling Gang</h2>
              <p className="text-sm text-gray-500">1 member</p>
            </div>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All 1</TabsTrigger>
              <TabsTrigger value="author">Author 1</TabsTrigger>
              <TabsTrigger value="assignee">Assignee 1</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <div className="p-4">
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-gray-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Add task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4 py-4">
                <Input id="task-title" placeholder="Task title" />
                <Textarea id="task-description" placeholder="Description..." />
                <div className="flex items-center">
                  <Paperclip className="mr-2 h-4 w-4" />
                  <span className="text-sm text-purple-600">Attach files</span>
                  <span className="ml-1 text-xs text-purple-600 bg-purple-100 px-1 rounded">
                    Pro
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Date planned</span>
                  <div className="flex items-center">
                    <span className="mr-2">Today</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Repeat</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">
                      Set specific time
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Flag className="mr-2 h-4 w-4" />
                  <span className="text-sm text-purple-600">Date due</span>
                  <span className="ml-1 text-xs text-purple-600 bg-purple-100 px-1 rounded">
                    Pro
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Project</span>
                  <div className="flex items-center">
                    <span className="mr-2">Sibling Gang</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Assignees</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">Assign</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <Button className="w-full">Create</Button>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Checkbox id="task" />
            <label htmlFor="task" className="ml-2 text-sm font-medium">
              Test
            </label>
            <span className="ml-auto text-xs text-red-500">Sep 13</span>
            <Avatar className="w-6 h-6 ml-2">
              <AvatarImage src="/placeholder-avatar.jpg" alt="AS" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Completed</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">1</span>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </Card>

      <div className="fixed bottom-4 right-4">
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
