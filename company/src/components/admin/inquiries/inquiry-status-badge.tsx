import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getInquiryStatusLabel } from "@/src/lib/investor-inquiries/inquiry-labels";

type InquiryStatusBadgeProps = {
  status: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  NEW:
    "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",

  CONTACTED:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",

  MEETING_SCHEDULED:
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",

  QUALIFIED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

  FOLLOW_UP:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",

  CLOSED:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",

  REJECTED:
    "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function InquiryStatusBadge({
  status,
  className,
}: InquiryStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-semibold",
        statusStyles[status],
        className,
      )}
      variant="outline"
    >
      {getInquiryStatusLabel(status)}
    </Badge>
  );
}