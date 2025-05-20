import { BASE_API_URL, isApiOnline, checkOKResponse, ApiResponse } from "./restAPIRequest";
import Cookies from "js-cookie";



export const getSubCategoriesbyCategory = async (id_category: string) => {
  try {
    // Ambil token JWT dari localStorage
    const TOKEN = Cookies.get("token");

    // Cek apakah API online
    const apiOnline = await isApiOnline();
    if (!apiOnline) {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    }


    const url = `${BASE_API_URL}/api/subcategories?id_categories=${id_category}`;

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

    // console.log(data);

    return data.data;

  } catch (error) {
    console.error("Error Fetching transactions", error);
    return error;
  }
};

