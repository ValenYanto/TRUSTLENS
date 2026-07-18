import { randomBytes } from "node:crypto";

export function generateInquiryCode(
  date = new Date(),
) {
  const year = date.getUTCFullYear();

  const randomCode = randomBytes(6)
    .toString("hex")
    .toUpperCase();

  return `TL-${year}-${randomCode}`;
}