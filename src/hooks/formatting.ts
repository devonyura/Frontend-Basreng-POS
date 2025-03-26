export function rupiahFormat(value: string) {
  // Menghapus titik desimal yang tidak diperlukan
  let cleanValue = value.toString().replace(/\.00$/, "").replace(/\./g, "");

  // Konversi ke angka
  let number = parseInt(cleanValue, 10);

  // Format ke Rupiah
  return "Rp." + number.toLocaleString("id-ID");
}