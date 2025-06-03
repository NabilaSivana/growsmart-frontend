// src/models/profile-model.js
import { getProfile, updateProfile } from "../../../data/api";

export default class ProfileModel {
  async getUserProfile(token) {
    try {
      const data = await getProfile(token);
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  async updateUserProfile(id, { name, email, password, metadata }, token) {
    try {
      const data = await editProfile(
        id,
        { name, email, password, metadata },
        token
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id, { currentPassword, newPassword }, token) {
    try {
      // Using the same endpoint but only sending password-related data
      const data = await updateProfile(
        id,
        {
          password: newPassword,
          metadata: { currentPassword }, // Storing current password in metadata if needed
        },
        token
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
