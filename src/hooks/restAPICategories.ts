import { BASE_API_URL, isApiOnline, checkOKResponse, ApiResponse } from "./restAPIRequest";
import Cookies from "js-cookie";

export interface Category {
  id: string;
  name: string;
}

export const getCategories = async (): Promise<Category | any> => {
  try {
    // Ambil token JWT dari localStorage
    const TOKEN = Cookies.get("token");

    // Cek apakah API online
    const apiOnline = await isApiOnline();
    if (!apiOnline) {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    }


    const url = `${BASE_API_URL}/api/categories`;

    // Konfigurasi request dengan header Authorization
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
      },
    });

    // Check Response
    checkOKResponse(response);

    // Ubah data ke json format
    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error("Error Fetching transactions", error);
    return error;
  }
};

