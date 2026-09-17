
export const isInternal = (href) =>
  typeof href === "string" && href.startsWith("/");
