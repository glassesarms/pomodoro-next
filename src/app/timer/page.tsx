"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Timer from "./timer";
import TaskManager from "./taskManager";

export default function TimerPage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleSessionComplete = (taskId: number, duration: number) => {
    console.log(`Session completed for Task ${taskId}: ${duration} seconds`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 gap-4">
		<Timer selectedTask={selectedTask} onSessionComplete={handleSessionComplete} />
		<TaskManager onTaskSelect={setSelectedTask} onSessionComplete={handleSessionComplete} />
    </main>
  );
}
