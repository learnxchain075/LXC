import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import path from "path"; // ✅ Import path module

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  fileType: "image" | "video" | "raw",
  originalName?: string
): Promise<{ publicId: string; url: string }> {
  const options: Record<string, any> = {
    folder,
    resource_type: fileType,
    use_filename: false, // disable to fully control the filename
    unique_filename: false,
  };

  // ✅ Ensure original filename with extension is passed to Cloudinary
  if (originalName) {
    const nameWithoutExt = path.parse(originalName).name; // 'Teenz SRS'
    const ext = path.extname(originalName); // '.pdf'

    // Sanitize: Remove spaces or handle them properly (optional)
    const safeName = nameWithoutExt.replace(/\s+/g, "_"); // 'Teenz_SRS'

    // ✅ Final filename (with extension)
    options.public_id = `${folder}/${safeName}${ext}`; // 'joining_letters/Teenz_SRS.pdf'
  }

  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(new Error(`Upload failed: ${error?.message || "Unknown error"}`));
      } else {
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      }
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
