"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorPicker } from "@/components/ui/colorPicker";

interface Task {
  id: number;
  name: string;
  color: string;
  sessions: number;
  totalTime: number;
}

interface TaskManagerProps {
  onTaskSelect: (taskId: number | null) => void;
  onSessionComplete: (taskId: number, duration: number) => void;
}

const predefinedColors = ["blue", "red", "green", "yellow", "purple"];

export default function TaskManager({ onTaskSelect, onSessionComplete }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now(), name: newTask, sessions: 0, totalTime: 0, color: selectedColor };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const removeTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mt-6 text-left">
          <div className="flex mt-2 gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
            />
            <Button onClick={addTask}>Add</Button>
          </div>
        </div>

        <div className="mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Select Task</Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <ul className="text-left">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <li
                      key={task.id}
                      onClick={() => onTaskSelect(task.id)}
                      className={`cursor-pointer p-2 rounded mt-1 text-white bg-${task.color} hover:opacity-80`}
                    >
                      {task.name}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tasks available</p>
                )}
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between p-2 rounded bg-gray-500 text-white`}
            >
              <span className="cursor-pointer">{task.name}</span>
              <Button onClick={() => removeTask(task.id)} variant="destructive" size="sm">
                ✕
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}