export const getDefaultDate = () => `${new Date().getFullYear()}-12-31`;

export const daysRemaining = (dateStr) => {
  if (!dateStr) return 0;
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.ceil((target - today) / 86400000));
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
