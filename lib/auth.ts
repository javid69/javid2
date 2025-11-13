export async function auth(): Promise<{
  user?: { id: string; email: string; name?: string };
} | null> {
  return null;
}
