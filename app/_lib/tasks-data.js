// app/_lib/tasks-data.js
import { createClient } from "@/utils/supabase/server";

// ✅ Čisto server – len práca s DB, žiadne toastovanie.

// MARK: GET ALL TASKS
export async function getTasks() {
    const supabase = await createClient();

    const { data: tasks, error } = await supabase.from("tasks").select("*");

    if (error) {
        console.error("Chyba pri načítaní všetkých zadaní:", error);
        return [];
    }

    return tasks;
}

// MARK: GET TASK BY ID
export async function getTask(id) {
    const supabase = await createClient();

    const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Chyba pri načítaní úlohy:", error);
        return null;
    }

    return task;
}

// MARK: CREATE TASK
export async function createTask(task) {
    const supabase = await createClient();

    const { data: newTask, error } = await supabase.from("tasks").insert(task);

    if (error) {
        console.error("Chyba pri vytvorení novej úlohy:", error);
        return null;
    }

    return newTask;
}

// MARK: UPDATE TASK
export async function updateTask(task) {
    const supabase = await createClient();

    const { data: updatedTask, error } = await supabase
        .from("tasks")
        .update(task)
        .eq("id", task.id)
        .select("*")
        .single();

    if (error) {
        console.error("Chyba pri aktualizácii úlohy:", error);
        return null;
    }

    return updatedTask;
}

// MARK: GET TASKS FOR TODAY + TOMORROW
export async function getTasksForTodayAndTomorrow() {
    const supabase = await createClient();

    // 1) today / tomorrow ako YYYY-MM-DD
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayIso = today.toISOString().slice(0, 10);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);

    // 2) jeden dotaz v rozsahu today..tomorrow
    const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .gte("dateFrom", todayIso)
        .lte("dateFrom", tomorrowIso);

    if (error) {
        console.error("Supabase error – tasks today+tomorrow:", error);
        throw error;
    }

    // 3) roztriedenie
    const tasksForToday = tasks.filter((t) => t.dateFrom === todayIso);
    const tasksForTmrw = tasks.filter((t) => t.dateFrom === tomorrowIso);

    return { tasksForToday, tasksForTmrw };
}
