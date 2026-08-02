export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary env vars missing. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME " +
      "and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    )
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)
  formData.append("folder", "nexura/events")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || "Cloudinary upload failed")
  }

  const data = await res.json()

  // Return the secure HTTPS URL of the uploaded image
  return data.secure_url as string
}
