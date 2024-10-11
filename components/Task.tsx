"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Calendar,
  RotateCw,
  Flag,
  Inbox,
  Clock,
  ChevronRight,
  Trash2,
  CalendarPlus,
  MessageSquare,
} from "lucide-react";
import WebApp from "@twa-dev/sdk";
import { MainButton, SecondaryButton, BottomBar } from "@twa-dev/sdk/react";

export default function TaskView() {
  const [task, setTask] = useState({
    title: "Test",
    description: "",
    datePlanned: "Sep 13",
    repeat: "Set specific time",
    project: "Inbox",
    historyCount: 1,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="taskCheckbox" />
          <Input
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="text-lg font-semibold border-none"
          />
        </div>

        <Textarea
          placeholder="Description..."
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="min-h-[100px] border-none resize-none"
        />

        <div className="flex items-center text-gray-500">
          <Paperclip className="h-4 w-4 mr-2" />
          <span>Attach files</span>
          <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-1 rounded">
            Pro
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Date planned</span>
          </div>
          <div className="flex items-center text-blue-500">
            <span>{task.datePlanned}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <RotateCw className="h-4 w-4 mr-2" />
            <span>Repeat</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span>{task.repeat}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>

        <div className="flex items-center text-gray-500">
          <Flag className="h-4 w-4 mr-2" />
          <span>Date due</span>
          <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-1 rounded">
            Pro
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Inbox className="h-4 w-4 mr-2" />
            <span>Project</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span>{task.project}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>History and comments</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span>{task.historyCount}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="ghost" className="flex-1 text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="ghost" className="flex-1 text-blue-500">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add to calendar
          </Button>
          <Button variant="ghost" className="flex-1 text-blue-500">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss
          </Button>
        </div>
      </div>

      <div className="p-2">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Save
        </Button>
      </div>
    </div>
  );
}
