export function rupiahFormat(value: string | number, withRp: boolean = true) {
  // Menghapus titik desimal yang tidak diperlukan
  let cleanValue = value.toString().replace(/\.00$/, "").replace(/\./g, "");

  // Konversi ke angka
  let number = parseInt(cleanValue, 10);

  return (withRp) ? 'Rp.' + number.toLocaleString("id-ID") : '' + number.toLocaleString("id-ID");
}


export function generateReceiptNumber(branchID: number, username: string | any): string {
  const now = new Date();
  const ddmmyy = `${String(now.getDate()).padStart(2, "0")}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}${String(now.getFullYear()).slice(2)}`;
  const hhii = `${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  return `C${branchID}-${ddmmyy}-${hhii}-${username.toUpperCase()}`;
}

export function calculateChange(cashGiven: number, total: number): number {
  if (cashGiven && cashGiven > total) {
    return cashGiven - total;
  }
  return 0;
};
