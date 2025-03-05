"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TimerPage() {
    const WORK_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [workSessions, setWorkSessions] = useState<number>(0);

    useEffect(() => {
	if (typeof window !== "undefined") {
	    const storedSessions = Number(localStorage.getItem("workSessions")) || 0;
	    setWorkSessions(storedSessions);
	}
    }, []);

    useEffect(() => {
	if (typeof window !== "undefined" && "Notification" in window) {
	    Notification.requestPermission();
	}
    }, []);

    useEffect(() => {
	let timer: NodeJS.Timeout;
	if (isRunning && timeLeft > 0) {
	    timer = setInterval(() => {
		setTimeLeft((prev) => prev - 1);
	    }, 1000);
	} else if (timeLeft === 0) {
	    sendNotification();
	    if (isWorkSession) {
		trackWorkSession();
	    };
	    switchSession();
	}
	return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const sendNotification = () => {
	if (Notification.permission === "granted") {
	    new Notification(isWorkSession ? "Time to take a break" : "Time for work", {
		body: isWorkSession ? "Your work session has ended" : "Your break time is over",
		icon: "/favicon.ico",
	    });
	}
    };

    const trackWorkSession = () => {
	const updatedSessions = workSessions + 1;
	setWorkSessions(updatedSessions);
	localStorage.setItem("workSessions", updatedSessions.toString());
    };

    const switchSession = () => {
	setIsRunning(false);
	if (isWorkSession) {
	    setTimeLeft(BREAK_TIME);
	} else {
	    setTimeLeft(WORK_TIME);
	}
	setIsWorkSession(!isWorkSession);
    };

    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
	setIsRunning(false);
	setIsWorkSession(true);
	setTimeLeft(WORK_TIME);
    };

    const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
	<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
	<Card className="w-full max-w-md">
	<CardHeader>
	<CardTitle className="text-center">
	{isWorkSession ? "Work" : "Break"}
	</CardTitle>
	</CardHeader>
	<CardContent className="text-center">
	<p className="text-5xl font-bold">{formatTime(timeLeft)}</p>
	<div className="flex justify-center gap-4 mt-4">
	{isRunning ? (
	    <Button onClick={pauseTimer} variant="info">
	    Pause
	    </Button>
	) : (
	<Button onClick={startTimer}>Start</Button>
	)}
	<Button onClick={resetTimer} variant="secondary">
	Reset
	</Button>
	</div>
	<p className="mt-4 text-gray-700">
	Sessions: <span className="font-bold">{workSessions}</span>
	</p>
	</CardContent>
	</Card>
	</main>
    );
}
