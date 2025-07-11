import Counter from "../models/Counter.js";

export const generateCodeDossier = async (type) => {
  const map = {
    création: "CR",
    modification: "MD",
    fermeture: "FR"
  };
  const prefix = map[type] || "DS";

  const counter = await Counter.findOneAndUpdate(
    { type },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `${prefix}-${padded}`;
};
