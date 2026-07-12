export const getProfile = async (http) => {
  const response = await http.get("profile");
  return response.data;
};

export const getDocumentTypes = async (http) => {
  const response = await http.get("document-types");
  return response.data;
};

export const updateProfile = async (http, payload) => {
  const hasFile = payload.image instanceof File;

  if (hasFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Remove the default JSON content type so the browser sets multipart with boundary.
    const response = await http.post("profile/update", formData, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  }

  const response = await http.post("profile/update", payload);
  return response.data;
};
