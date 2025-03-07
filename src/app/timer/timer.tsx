"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimerProps {
  selectedTask: number | null;
  onSessionComplete: (taskId: number, duration: number) => void;
}

export default function Timer({ selectedTask, onSessionComplete }: TimerProps) {
  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWorkSession && selectedTask !== null) {
        onSessionComplete(selectedTask, WORK_TIME);
      }
      switchSession();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchSession = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? BREAK_TIME : WORK_TIME);
    setIsWorkSession(!isWorkSession);
  };

  const startTimer = () => {
    if (selectedTask === null) {
      alert("Please select a task before starting the timer.");
      return;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(WORK_TIME);
  };

  return (
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-center">Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <div className="text-center">
                <p className="text-5xl font-bold">{`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}</p>
                <div className="flex justify-center gap-4 mt-4">
                    {isRunning ? (
                    <Button onClick={pauseTimer} variant="destructive">Pause</Button>
                    ) : (
                    <Button onClick={startTimer}>Start</Button>
                    )}
                    <Button onClick={resetTimer} variant="secondary">Reset</Button>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
