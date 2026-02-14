export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

export const isCancelError = (error: unknown): boolean => {
  const err = error as { name?: string; code?: string };
  return err.name === "CanceledError" || err.code === "ERR_CANCELED";
};
