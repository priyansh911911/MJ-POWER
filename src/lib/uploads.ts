// @ts-nocheck
export async function uploadImage(file: File): Promise<string | null> {
  console.log('🖼️ Starting image upload...');
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
  console.log('Upload URL:', process.env.NEXT_PUBLIC_UPLOADS_API_URL);
  
  const formData = new FormData();
  formData.append("folder", "packages");
  formData.append("image", file);

  try {
    console.log('📤 Sending upload request...');
    const res = await fetch(process.env.NEXT_PUBLIC_UPLOADS_API_URL!, {
      method: "POST",
      headers: {
        username: "admin",
        password: "arodos",
      } as any,
      body: formData,
    });

    console.log('📥 Upload response status:', res.status);
    console.log('📥 Upload response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Upload failed response:', errorText);
      throw new Error(`Upload failed with status ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ Upload response data:', data);

    const p = data?.files?.image as string;
    console.log('📁 Image path from response:', p);
    
    if (!p) {
      console.error('❌ No image path in response');
      return null;
    }

    const parts = p.split("/");
    const filename = parts[parts.length - 1] || null;
    console.log('📄 Final filename:', filename);
    
    return filename;
  } catch (err: any) {
    console.error("❌ Upload Error:", err.message);
    console.error("❌ Full error:", err);
    return null;
  }
}


