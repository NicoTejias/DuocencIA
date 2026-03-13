import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Recordatorio de racha: Todos los días a las 19:00 hora Chile (aproximadamente)
// Convex usa UTC, por lo que 19:00 Chile (CLT, UTC-3) son las 22:00 UTC.
crons.daily(
  "streak-reminder-daily",
  { hourUTC: 22, minuteUTC: 0 },
  api.streak_reminders.checkStreaksAndNotify
);

export default crons;
