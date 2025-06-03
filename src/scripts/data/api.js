// File: /data/api.js
import CONFIG from "../config";

const ENDPOINTS = {
  BASE: CONFIG.BASE_URL,
  LOGIN: `${CONFIG.BASE_URL}/api/auth/login`,
  REGISTER: `${CONFIG.BASE_URL}/api/auth/register`,
  PROFILE: `${CONFIG.BASE_URL}/api/auth/me`,
  UPDATEPROFILE: (id) => `${CONFIG.BASE_URL}/api/auth/me/${id}`,
  PREDICT: `${CONFIG.BASE_URL}/api/predict`,
};

// Login user
export async function login({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login gagal");
    }

    return await response.json(); // { message, session, user }
  } catch (error) {
    throw error;
  }
}

// Register user
export async function register({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        data: { name },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registrasi gagal");
    }

    return await response.json(); // { message, user }
  } catch (error) {
    throw error;
  }
}

// Get user profile from token
export async function getProfile(token) {
  try {
    const response = await fetch(ENDPOINTS.PROFILE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Gagal memuat profil");
    }

    return await response.json(); // { user }
  } catch (error) {
    throw error;
  }
}

// Update user profile
export async function updateProfile({ id, token, email, password, data }) {
  try {
    const response = await fetch(ENDPOINTS.UPDATEPROFILE(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...(email && { email }),
        ...(password && { password }),
        ...(data && { data }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Gagal memperbarui profil");
    }

    return await response.json(); // { message, user }
  } catch (error) {
    throw error;
  }
}

// Guest prediction (non-auth)
export async function predictStuntingGuest({ gender, age, height, weight }) {
  try {
    const response = await fetch(ENDPOINTS.PREDICT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gender,
        age,
        height,
        weight,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Prediksi gagal");
    }

    return await response.json(); // hasil prediksi
  } catch (error) {
    throw error;
  }
}

export default {
  login,
  register,
  getProfile,
  updateProfile,
  predictStuntingGuest,
};
