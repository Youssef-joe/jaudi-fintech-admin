export const fetchAuditLogs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/audit-logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  return await res.json();
};
