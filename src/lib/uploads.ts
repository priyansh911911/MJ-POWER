// @ts-nocheck
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("folder", "packages");
  formData.append("image", file);

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_UPLOADS_API_URL!, {
      method: "POST",
      headers: {
        username: "admin",
        password: "arodos",
      } as any,
      body: formData,
    });

    if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
    const data = await res.json();

    const p = data?.files?.image as string;
    if (!p) return null;

    const parts = p.split("/");
    return parts[parts.length - 1] || null;
  } catch (err: any) {
    console.error("Upload Error:", err.message);
    return null;
  }
}


