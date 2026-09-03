const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

function readEnvFile() {
  const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    env[key] = value;
  }

  return env;
}

const profileIds = {
  "Hrabovcova Eva, Mgr.": "35c96836-27c3-4c1a-92db-95cfd0250b6e",
  "Kulha Jakub, Bc.": "e89828ff-4f59-45a9-82e7-057b9374aef6",
  "Kubacakova Klara, Bc.": "87859f26-d59e-45bb-a300-d0c42da95070",
  "Kubis Jozef, Bc.": "3f26b7cf-5fbc-43e6-aec8-b24338b53a02",
  "Cibulak Juraj, Ing.": "7eb446b5-a462-43ac-8159-4f3fc9265af8",
  "Kralik Vladimir, Mgr.": "18aa74a8-3cf2-4d69-ab0f-1e7823184b3f",
  "Bojanovsky Peter, Bc.": "2f41a3e7-72e6-45ce-8c8f-4d7fa7b874ef",
  "Martinka Daniel, Bc.": "9a2fefff-8dc7-48d3-9ce4-c33b6037f085",
  "Jakubsky Juraj, Bc.": "6e552823-0259-48da-9c69-aa67cffda5c7",
  "Dorinsky Jozef, Mgr.": "8690bafe-2b1a-4637-88fc-f23d01cb86b9",
  "Cecho Michal, Mgr.": "3adf9390-4257-4208-bbf1-17d9a7e03186",
};

const rosterOrder = {
  "Hrabovcova Eva, Mgr.": 1,
  "Kulha Jakub, Bc.": 2,
  "Kubacakova Klara, Bc.": 3,
  "Kubis Jozef, Bc.": 4,
  "Cibulak Juraj, Ing.": 5,
  "Kralik Vladimir, Mgr.": 6,
  "Bojanovsky Peter, Bc.": 7,
  "Martinka Daniel, Bc.": 8,
  "Jakubsky Juraj, Bc.": 9,
  "Dorinsky Jozef, Mgr.": 10,
  "Cecho Michal, Mgr.": 11,
};

const shiftsByProfile = [
  {
    name: "Hrabovcova Eva, Mgr.",
    shifts: {
      2: "D",
      5: "D",
      6: "N",
      8: "D",
      9: "N",
      10: "N",
      11: "X",
      12: "N",
      14: "D",
      16: "D",
      17: "D",
      18: "RD",
      19: "X",
      20: "X",
      21: "RD",
      22: "RD",
      23: "RD",
      24: "RD",
      25: "RD",
      26: "X",
      27: "X",
      28: "RD",
      29: "RD",
      30: "RD",
    },
  },
  {
    name: "Kulha Jakub, Bc.",
    shifts: {
      1: "N",
      3: "N",
      5: "N",
      7: "D",
      8: "N",
      10: "D",
      11: "X",
      12: "X",
      13: "X",
      15: "D",
      18: "D",
      19: "N",
      21: "D",
      22: "N",
      24: "D",
      25: "N",
      26: "X",
      27: "D",
      28: "N",
      30: "D",
    },
  },
  {
    name: "Kubacakova Klara, Bc.",
    shifts: {
      1: "D",
      2: "N",
      4: "D",
      5: "X",
      6: "X",
      7: "RD",
      8: "RD",
      9: "RD",
      10: "RD",
      11: "RD",
      12: "X",
      13: "N",
      15: "N",
      18: "X",
      19: "D",
      20: "N",
      22: "D",
      25: "D",
      26: "D",
      27: "N",
      28: "X",
      29: "D",
    },
  },
  {
    name: "Kubis Jozef, Bc.",
    shifts: {
      3: "D",
      4: "N",
      6: "D",
      7: "N",
      9: "D",
      11: "D",
      12: "D",
      14: "N",
      16: "RD",
      17: "RD",
      18: "RD",
      19: "X",
      21: "N",
      23: "D",
      24: "N",
      26: "N",
      28: "D",
      29: "N",
    },
  },
  {
    name: "Cibulak Juraj, Ing.",
    shifts: {
      1: "RD",
      2: "RD",
      3: "RD",
      4: "RD",
      6: "N",
      14: "D",
      17: "N",
      21: "RD",
      22: "RD",
      23: "RD",
      24: "RD",
      25: "RD",
      28: "RD",
      29: "RD",
      30: "RD",
    },
  },
  {
    name: "Kralik Vladimir, Mgr.",
    shifts: {
      1: "X",
      2: "X",
      3: "N",
      7: "RD",
      8: "RD",
      9: "RD",
      10: "RD",
      11: "RD",
      12: "X",
      13: "X",
      14: "X",
      15: "X",
      16: "N",
      18: "N",
      20: "D",
      23: "N",
      25: "N",
      30: "N",
    },
  },
  {
    name: "Bojanovsky Peter, Bc.",
    shifts: {
      2: "D",
      5: "D",
      9: "D",
      11: "D",
      12: "N",
      14: "N",
      15: "X",
      16: "N",
      17: "X",
      18: "D",
      19: "N",
      22: "D",
      23: "N",
      25: "D",
      26: "N",
      29: "D",
      30: "N",
    },
  },
  {
    name: "Martinka Daniel, Bc.",
    shifts: {
      1: "D",
      2: "N",
      4: "D",
      5: "N",
      7: "D",
      8: "N",
      11: "N",
      12: "X",
      13: "D",
      14: "RD",
      15: "X",
      16: "RD",
      17: "RD",
      18: "RD",
      19: "X",
      20: "X",
      21: "D",
      22: "N",
      26: "D",
      27: "N",
      30: "D",
    },
  },
  {
    name: "Jakubsky Juraj, Bc.",
    shifts: {
      1: "RD",
      2: "RD",
      3: "RD",
      4: "RD",
      5: "X",
      6: "X",
      7: "RD",
      8: "D",
      9: "N",
      10: "N",
      12: "D",
      13: "N",
      16: "D",
      17: "N",
      19: "D",
      21: "N",
      24: "D",
      28: "D",
      29: "N",
    },
  },
  {
    name: "Dorinsky Jozef, Mgr.",
    shifts: {
      1: "N",
      4: "N",
      6: "D",
      7: "N",
      10: "D",
      11: "N",
      12: "X",
      13: "D",
      15: "N",
      17: "D",
      18: "N",
      20: "D",
      23: "D",
      24: "N",
      27: "D",
      28: "N",
    },
  },
  {
    name: "Cecho Michal, Mgr.",
    shifts: {
      1: "X",
      3: "D",
      4: "X",
      7: "X",
      10: "X",
      13: "X",
      15: "D",
      16: "X",
      18: "X",
      19: "N",
      22: "X",
      25: "X",
      28: "X",
    },
  },
];

const requestsByProfile = [
  {
    name: "Hrabovcova Eva, Mgr.",
    requests: {
      2: "xN",
      3: "xD",
      12: "xD",
      17: "xN",
    },
  },
  {
    name: "Kulha Jakub, Bc.",
    requests: {
      10: "xN",
      26: "xD",
    },
  },
  {
    name: "Kubacakova Klara, Bc.",
    requests: {
      3: "xD",
      4: "xN",
      13: "xD",
      17: "xN",
    },
  },
  {
    name: "Bojanovsky Peter, Bc.",
    requests: {
      23: "xD",
    },
  },
];

const roleMarkersByProfile = [
  {
    name: "Kulha Jakub, Bc.",
    markers: {
      1: "v",
      23: "v",
    },
  },
  {
    name: "Kubis Jozef, Bc.",
    markers: {
      12: "v",
      21: "v",
      28: "v",
    },
  },
  {
    name: "Cibulak Juraj, Ing.",
    markers: {
      6: "v",
      14: "v",
      17: "v",
    },
  },
  {
    name: "Kralik Vladimir, Mgr.",
    markers: {
      3: "v",
      16: "z",
      18: "v",
      20: "v",
      23: "z",
      25: "v",
      30: "z",
    },
  },
  {
    name: "Jakubsky Juraj, Bc.",
    markers: {
      12: "z",
      17: "z",
      21: "z",
      24: "z",
      28: "z",
    },
  },
  {
    name: "Dorinsky Jozef, Mgr.",
    markers: {
      1: "z",
      11: "z",
      13: "z",
      18: "z",
      20: "z",
    },
  },
];

const clearCells = [
  { name: "Jakubsky Juraj, Bc.", day: 14 },
  { name: "Dorinsky Jozef, Mgr.", day: 16 },
  { name: "Cecho Michal, Mgr.", day: 20 },
];

function padDay(day) {
  return String(day).padStart(2, "0");
}

function applyRoleMarker(shiftType, marker) {
  if (!marker) return shiftType;
  if (shiftType === "D") return `${marker}D`;
  if (shiftType === "N") return `${marker}N`;
  return shiftType;
}

function createRow({ userId, date, shiftType, orderIndex }) {
  if (shiftType === "X") {
    return {
      user_id: userId,
      date,
      shift_type: null,
      request_type: "X",
      request_hours: null,
      order_index: orderIndex,
    };
  }

  return {
    user_id: userId,
    date,
    shift_type: shiftType,
    request_type: null,
    request_hours: null,
    order_index: orderIndex,
  };
}

function buildRows() {
  const rowsByProfileAndDay = new Map();

  for (const profile of shiftsByProfile) {
    const userId = profileIds[profile.name];
    const orderIndex = rosterOrder[profile.name];

    for (const [day, shiftType] of Object.entries(profile.shifts)) {
      rowsByProfileAndDay.set(
        `${profile.name}#${day}`,
        createRow({
          userId,
          date: `2026-09-${padDay(day)}`,
          shiftType,
          orderIndex,
        }),
      );
    }
  }

  for (const profile of roleMarkersByProfile) {
    for (const [day, marker] of Object.entries(profile.markers)) {
      const key = `${profile.name}#${day}`;
      const row = rowsByProfileAndDay.get(key);
      if (!row) continue;

      row.shift_type = applyRoleMarker(row.shift_type, marker);
    }
  }

  for (const profile of requestsByProfile) {
    const userId = profileIds[profile.name];
    const orderIndex = rosterOrder[profile.name];

    for (const [day, requestType] of Object.entries(profile.requests)) {
      const key = `${profile.name}#${day}`;
      const existingRow = rowsByProfileAndDay.get(key);

      if (existingRow) {
        existingRow.request_type = requestType;
        existingRow.request_hours = null;
      } else {
        rowsByProfileAndDay.set(key, {
          user_id: userId,
          date: `2026-09-${padDay(day)}`,
          shift_type: null,
          request_type: requestType,
          request_hours: null,
          order_index: orderIndex,
        });
      }
    }
  }

  return Array.from(rowsByProfileAndDay.values());
}

function countByProfile(rows) {
  const counts = {};

  for (const profile of shiftsByProfile) {
    counts[profile.name] = {
      D: 0,
      N: 0,
      vD: 0,
      vN: 0,
      zD: 0,
      zN: 0,
      RD: 0,
      X: 0,
      xD: 0,
      xN: 0,
      totalServices: 0,
    };
  }

  for (const row of rows) {
    const profile = shiftsByProfile.find((item) => profileIds[item.name] === row.user_id);
    const count = counts[profile.name];

    if (row.shift_type) {
      count[row.shift_type] = (count[row.shift_type] || 0) + 1;
    }

    if (row.request_type) {
      count[row.request_type] = (count[row.request_type] || 0) + 1;
    }

    if (["D", "N", "vD", "vN", "zD", "zN"].includes(row.shift_type)) {
      count.totalServices += 1;
    }
  }

  return counts;
}

async function main() {
  const env = readEnvFile();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const rows = buildRows();

  for (const cell of clearCells) {
    const { error } = await supabase
      .from("shifts")
      .update({
        shift_type: null,
        request_type: null,
        request_hours: null,
      })
      .eq("user_id", profileIds[cell.name])
      .eq("date", `2026-09-${padDay(cell.day)}`);

    if (error) {
      throw error;
    }
  }

  const { error } = await supabase
    .from("shifts")
    .upsert(rows, { onConflict: "user_id,date" });

  if (error) {
    throw error;
  }

  const { data: savedRows, error: verifyError } = await supabase
    .from("shifts")
    .select("user_id,date,shift_type,request_type,request_hours,order_index")
    .gte("date", "2026-09-01")
    .lte("date", "2026-09-30")
    .order("order_index", { ascending: true })
    .order("date", { ascending: true });

  if (verifyError) {
    throw verifyError;
  }

  console.log(JSON.stringify({
    upsertedRows: rows.length,
    savedRows: savedRows.filter(
      (row) => row.shift_type || row.request_type,
    ).length,
    counts: countByProfile(
      savedRows.filter((row) => row.shift_type || row.request_type),
    ),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
