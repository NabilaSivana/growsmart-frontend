import ProfilePresenter from "./profile-presenter";

export default class ProfileView {
  constructor() {
    this.presenter = new ProfilePresenter({ view: this });
    this.token = sessionStorage.getItem("token");
    this._userData = null;
  }

  get userData() {
    return this._userData;
  }

  set userData(data) {
    this._userData = data;
    this.reRender();
  }

  async render() {
    const user = this.userData;
    // Use email as name if name is not available in user_metadata
    const name =
      user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
    const email = user?.email || "email@example.com";

    return `
      <div class="bg-[#F4FFEF] min-h-screen pt-24 pb-10 px-4">
        <div class="bg-white p-4 m-4 rounded-lg shadow-sm">
          <p class="text-2xl font-bold mb-2">Profile</p>
        </div>

        <section class="p-6 m-4 bg-white rounded-lg shadow-sm">
          <div class="flex flex-col items-center">
            <img src="https://i.ibb.co/qCyJtQ8/user-avatar.png"
              alt="User Avatar"
              class="w-24 h-24 rounded-full object-cover mb-4 border-2 border-green-100" />
            <h2 class="text-xl font-semibold mb-2">${name}</h2>
            <p class="text-gray-600 mb-6">${email}</p>

            <button id="editBtn" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 mb-3">
              Edit Profile
            </button>

            <button id="changePasswordBtn" class="text-green-800 px-6 py-2 rounded-lg border-2 border-green-800 hover:bg-green-700 hover:text-white">
              Ubah Password
            </button>
          </div>

          <!-- Edit Form -->
          <form id="editProfileForm" class="hidden mt-8 max-w-md mx-auto space-y-4">
            <div>
              <label for="editName" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" id="editName" value="${name}" required
                class="w-full border p-2 rounded focus:ring-2 focus:ring-green-600" />
            </div>
            <div>
              <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="editEmail" value="${email}" required
                class="w-full border p-2 rounded focus:ring-2 focus:ring-green-600" />
            </div>
            <div class="flex space-x-2">
              <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1">Simpan</button>
              <button type="button" id="cancelEditBtn" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex-1">Batal</button>
            </div>
          </form>

          <!-- Password Form -->
          <form id="changePasswordForm" class="hidden mt-8 max-w-md mx-auto space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Password Lama</label>
              <input type="password" id="currentPassword" required minlength="6"
                class="w-full border p-2 rounded focus:ring-2 focus:ring-green-600" />
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">Password Baru</label>
              <input type="password" id="newPassword" required minlength="6"
                class="w-full border p-2 rounded focus:ring-2 focus:ring-green-600" />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input type="password" id="confirmPassword" required minlength="6"
                class="w-full border p-2 rounded focus:ring-2 focus:ring-green-600" />
            </div>
            <div class="flex space-x-2">
              <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1">Ubah Password</button>
              <button type="button" id="cancelPasswordBtn" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex-1">Batal</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  async afterRender() {
    if (this.token && !this.userData) {
      await this.presenter.loadUserProfile(this.token);
    }

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById("editBtn")?.addEventListener("click", () => {
      this.toggleVisibility("editProfileForm");
    });

    document
      .getElementById("changePasswordBtn")
      ?.addEventListener("click", () => {
        this.toggleVisibility("changePasswordForm");
      });

    document.getElementById("cancelEditBtn")?.addEventListener("click", () => {
      document.getElementById("editProfileForm").classList.add("hidden");
      this.resetEditForm();
    });

    document
      .getElementById("cancelPasswordBtn")
      ?.addEventListener("click", () => {
        document.getElementById("changePasswordForm").classList.add("hidden");
        this.resetPasswordForm();
      });

    document
      .getElementById("editProfileForm")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleEditProfile();
      });

    document
      .getElementById("changePasswordForm")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleChangePassword();
      });
  }

  toggleVisibility(formId) {
    const form = document.getElementById(formId);
    const otherForm =
      formId === "editProfileForm" ? "changePasswordForm" : "editProfileForm";
    form.classList.toggle("hidden");
    document.getElementById(otherForm)?.classList.add("hidden");
  }

  handleEditProfile() {
    const updatedData = {
      name: document.getElementById("editName").value,
      email: document.getElementById("editEmail").value,
    };
    this.presenter.handleEditProfile(this.userData.id, updatedData, this.token);
  }

  handleChangePassword() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      return this.onChangePasswordFailed(
        "Password baru dan konfirmasi tidak cocok"
      );
    }

    this.presenter.handleChangePassword(
      this.userData.id,
      { currentPassword, newPassword },
      this.token
    );
  }

  resetEditForm() {
    document.getElementById("editName").value =
      this.userData.user_metadata?.name || "";
    document.getElementById("editEmail").value = this.userData.email || "";
  }

  resetPasswordForm() {
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  }

  // === Callback dari Presenter ===
  async onLoadProfileSuccess(profile) {
    console.log("✅ Profil berhasil dimuat:", profile);
    this.userData = profile;
  }

  onLoadProfileFailed(message) {
    console.error("❌ Gagal memuat profil:", message);
    alert(`Gagal memuat profil: ${message}`);
  }

  onEditProfileSuccess(updatedProfile) {
    alert("✅ Profil berhasil diperbarui!");
    sessionStorage.setItem("user", JSON.stringify(updatedProfile));
    this.userData = updatedProfile;
  }

  onEditProfileFailed(message) {
    alert(`❌ Gagal mengedit profil: ${message}`);
  }

  onChangePasswordSuccess() {
    alert("✅ Password berhasil diubah!");
    this.resetPasswordForm();
    document.getElementById("changePasswordForm").classList.add("hidden");
  }

  onChangePasswordFailed(message) {
    alert(`❌ Gagal mengubah password: ${message}`);
  }

  async reRender() {
    const container = document.querySelector("#app");
    if (container) {
      container.innerHTML = await this.render();
      this.afterRender();
    }
  }
}
