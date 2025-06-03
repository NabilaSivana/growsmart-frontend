// src/presenters/profile-presenter.js
import ProfileModel from "../menu-profile/profile-model";

export default class ProfilePresenter {
  constructor({ view }) {
    this.view = view;
    this.model = new ProfileModel();
  }

  async loadUserProfile(token) {
    try {
      const userProfile = await this.model.getUserProfile(token);
      this.view.onLoadProfileSuccess(userProfile);
    } catch (error) {
      this.view.onLoadProfileFailed(error.message);
    }
  }

  async handleEditProfile(id, updatedData, token) {
    try {
      const updatedProfile = await this.model.updateUserProfile(
        id,
        updatedData,
        token
      );
      this.view.onEditProfileSuccess(updatedProfile);
    } catch (error) {
      this.view.onEditProfileFailed(error.message);
    }
  }

  async handleChangePassword(id, { currentPassword, newPassword }, token) {
    try {
      await this.model.changePassword(
        id,
        { currentPassword, newPassword },
        token
      );
      this.view.onChangePasswordSuccess();
    } catch (error) {
      this.view.onChangePasswordFailed(error.message);
    }
  }
}
