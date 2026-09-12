export async function notifyOwner(opts: { title: string; content: string }): Promise<{ delivered: boolean }> {
  console.log('Notifying owner:', opts);
  return { delivered: true };
}
