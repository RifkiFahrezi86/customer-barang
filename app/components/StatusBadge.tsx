// customer-web/app/components/StatusBadge.tsx
type StatusBadgeProps = {
  status: "pending" | "approved" | "rejected";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return { label: "⏳ Menunggu", className: "badge pending" };
      case "approved":
        return { label: "✅ Disetujui", className: "badge approved" };
      case "rejected":
        return { label: "❌ Ditolak", className: "badge rejected" };
    }
  };

  const config = getStatusConfig();

  return <span className={config.className}>{config.label}</span>;
}