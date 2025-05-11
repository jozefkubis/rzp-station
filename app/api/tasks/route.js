import { createTask, getTasks } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";
// uprav import podľa toho, kde máš svoje helpery na DB

export async function GET(request) {
    try {
        const tasks = await getTasks();
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("GET /api/tasks failed:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, date, startTime, endTime, description } = body;
        const newTask = await createTask({
            title,
            date: new Date(date),
            startTime: startTime ? new Date(startTime) : null,
            endTime: endTime ? new Date(endTime) : null,
            description,
        });
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("POST /api/tasks failed:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
