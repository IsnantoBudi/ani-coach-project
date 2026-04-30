import { KaitoResponse, KaitoQuestsResponse, KaitoAdviceResponse } from "@/types";

export function isKaitoAdviceResponse(res: unknown): res is KaitoAdviceResponse {
  return res !== null && typeof res === "object" && "dialog" in res && "suggested_quests" in res;
}

export function isKaitoQuestsResponse(res: unknown): res is KaitoQuestsResponse {
  return res !== null && typeof res === "object" && "quests" in res;
}

export function isKaitoResponse(res: unknown): res is KaitoResponse {
  return res !== null && typeof res === "object" && "exp" in res && "stats_boost" in res;
}
