import { useState } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getProfile, getDocumentTypes, updateProfile } from "@/services/profile";

export const useProfile = () => {
  const { http } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGetProfile = async () => {
    setLoading(true);
    try {
      const result = await getProfile(http);
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  const handleGetDocumentTypes = async () => {
    const result = await getDocumentTypes(http);
    return result.data;
  };

  const handleUpdateProfile = async (payload) => {
    setSaving(true);
    try {
      const result = await updateProfile(http, payload);
      return result.data;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    handleGetProfile,
    handleGetDocumentTypes,
    handleUpdateProfile,
  };
};
