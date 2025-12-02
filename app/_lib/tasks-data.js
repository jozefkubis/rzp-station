
import { getSupabaseServerClient, handleDbResult } from "./db";


// ✅ Čisto server – len práca s DB, žiadne toastovanie.

// MARK: GET ALL TASKS
export async function getTasks() {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.from("tasks").select("*");

    return handleDbResult({ data, error, fallback: [] });
}


// MARK: GET TASK BY ID
export async function getTask(id) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

    return handleDbResult({ data, error, fallback: null });
}


// MARK: CREATE TASK
export async function createTask(task) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("tasks")
        .insert(task)
        .select("*")
        .single();

    return handleDbResult({ data, error, fallback: null });
}


// MARK: UPDATE TASK
export async function updateTask(task) {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("tasks")
        .update(task)
        .eq("id", task.id)
        .select("*")
        .single();

    return handleDbResult({ data, error, fallback: null });
}

// MARK: GET TASKS FOR TODAY + TOMORROW
export async function getTasksForTodayAndTomorrow() {
    const supabase = await getSupabaseServerClient();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayIso = today.toISOString().slice(0, 10);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .gte("dateFrom", todayIso)
        .lte("dateFrom", tomorrowIso);

    const tasks = handleDbResult({ data, error, fallback: [] });

    const tasksForToday = tasks.filter((t) => t.dateFrom === todayIso);
    const tasksForTmrw = tasks.filter((t) => t.dateFrom === tomorrowIso);

    return { tasksForToday, tasksForTmrw };
}

