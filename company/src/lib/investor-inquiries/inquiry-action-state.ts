export type InquiryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  actionId: string;
};

export const initialInquiryActionState: InquiryActionState = {
  status: "idle",
  message: "",
  actionId: "",
};