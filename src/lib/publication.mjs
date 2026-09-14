// A missing status never implies consent to publish.
export function isPublished(data, now = new Date()) {
  return (
    data.status === "public" && new Date(data.date).getTime() <= now.getTime()
  );
}
