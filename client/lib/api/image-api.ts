const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"

export async function uploadSingleImage(file: File) {
  const url = `${SERVER_URL}/api/images/upload-single`
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to upload image")
  }
  return res.json()
}

export async function uploadBulkImages(files: File[]) {
  const url = `${SERVER_URL}/api/images/upload-bulk`
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to upload images")
  }
  return res.json()
}

export async function deleteImage(id: string) {
  const url = `${SERVER_URL}/api/images/${id}`
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to delete image")
  }
  return res.json()
}
