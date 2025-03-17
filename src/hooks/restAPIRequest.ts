import React from "react";
import Cookies from "js-cookie";
// const BASE_API_URL = "https://api.rindapermai.com"
const BASE_API_URL = "http://localhost:8080"

export interface ApiResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export interface Student {
	id: string;
	name: string;
	address: string;
	gender: string;
}

export interface Auth {
	username: string;
	password: string;
}

export interface DataToken {
	status: string;
	message: string;
	token: string;
}

export const isApiOnline = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${BASE_API_URL}/api/ping`, { method: "HEAD" });
		return response.ok;
	} catch (error) {
		console.warn("API Offline:", error);
		return false;
	}
};

export const loginRequest = async (authData: Auth): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {

			// Cek apakah API online
			const apiOnline = await isApiOnline();
			if (!apiOnline) {
				reject("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
				return;
			}

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(authData),
			});

			// Check Response
			checkOKResponse(response)

			// Ubah data ke json format
			const data: DataToken = await response.json();

			console.info("Status Request loginRequest() : ", data.status);

			resolve({ success: true, data });

		}
		catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.log("Error Login:", error);
			reject("Username atau Password salah!.");
		}
	});
};

const checkOKResponse = (response: any) => {
	console.log(response);
	if (!response.ok) {
		if (response.status === 401) {
			console.error("Unauthorized! Token mungkin sudah expired/salah.")
		}
		throw new Error(`HTTP error! Status: ${response.status}`)
	}
}


export const getAllData = async (setStudens: React.Dispatch<React.SetStateAction<Student[]>>) => {
	try {
		// Ambil token JWT dari localStorage
		const TOKEN = Cookies.get("token");

		// Cek apakah API online
		const apiOnline = await isApiOnline();
		if (!apiOnline) {
			return "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
		}

		// Konfigurasi request dengan header Authorization
		const response = await fetch(`${BASE_API_URL}/api/siswa`, {
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

		console.info("Status Request getAllData() : ", data.status);

		// set State student
		setStudens(data.data);

	} catch (error) {
		// Kirim error jika gagal request
		console.error("Error Fetching Students", error);
		return error;
	}
};

// export const getDataById = async (id: string): Promise<Student | null> => {
// 	try {
// 		// Ambil token JWT dari localStorage
// 		const TOKEN = Cookies.get("token");

// 		// Konfigurasi request dengan header Authorization
// 		const response = await fetch(`${BASE_API_URL}/api/siswa/${id}`, {
// 			method: "GET",
// 			credentials: "include",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Authorization": `Bearer ${TOKEN}`,
// 			},
// 		});

// 		// Check Response
// 		checkOKResponse(response);

// 		// Ubah data ke json format
// 		const data = await response.json();

// 		console.info("Status Request getDataById() : ", data.status);

// 		// set State student
// 		return data.data;

// 	} catch (error) {
// 		console.error("Error Fetching Student by ID:", error);
// 		return null;
// 	}
// };


export const saveData = async (newStudents: object): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {
			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Cek apakah API online
			const apiOnline = await isApiOnline();
			if (!apiOnline) {
				resolve({ success: false, error: "Tidak dapat terhubung ke server. Periksa koneksi Anda." });
				return { success: false, error: "Tidak dapat terhubung ke server. Periksa koneksi Anda." };
			}

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`${BASE_API_URL}/api/siswa`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				},
				body: JSON.stringify(newStudents),
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request saveData() : ", data.status);
			resolve({ success: true, data });
		}
		catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Fetching Students:", error);
			reject({ success: false, error: errorMessage || "Terjadi kesalahan" });
		}
	});
};

// Function untuk menghapus data siswa berdasarkan ID
export const deleteData = async (id: string): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {

			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Cek apakah API online
			const apiOnline = await isApiOnline();
			if (!apiOnline) {
				reject({ success: false, error: "Tidak dapat terhubung ke server. Periksa koneksi Anda." });
				return
			}

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`${BASE_API_URL}/api/siswa/${id}`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				}
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request deleteData() : ", data.status);
			resolve({ success: true });

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Deleting Student:", errorMessage);
			reject({ success: false, error: errorMessage });
		}
	});
};

export const updateData = async (id: string, updatedStudent: object): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {

			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Cek apakah API online
			const apiOnline = await isApiOnline();
			if (!apiOnline) {
				reject({ success: false, error: "Tidak dapat terhubung ke server. Periksa koneksi Anda." });
				return;
			}

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`${BASE_API_URL}/api/siswa/${id}`, {
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				},
				body: JSON.stringify(updatedStudent),
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request updateData() : ", data.status);
			resolve({ success: true, data });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Editing Student:", error);
			reject({ success: false, error: errorMessage });
		}
	});
};