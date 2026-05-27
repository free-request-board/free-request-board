import crypto from "crypto";

export function makeToken(prefix: string) {
  return `${prefix}_${crypto.randomBytes(24).toString("hex")}`;
}
