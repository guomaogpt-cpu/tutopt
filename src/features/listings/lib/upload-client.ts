type UploadSuccessBody = {
  data: {
    url: string;
    filename: string;
  };
};

type UploadErrorBody = {
  error: {
    message: string;
  };
};

export async function uploadListingImageRequest(
  file: File,
): Promise<UploadSuccessBody["data"]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads/listing-images", {
    method: "POST",
    body: formData,
  });

  const body = (await response.json()) as UploadSuccessBody | UploadErrorBody;

  if (!response.ok) {
    const message =
      "error" in body ? body.error.message : "Не удалось загрузить изображение";
    throw new Error(message);
  }

  return (body as UploadSuccessBody).data;
}
