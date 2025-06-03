import { toBlob } from "html-to-image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { rupiahFormat } from "../../hooks/formatting";
import { AllReportsResponse, BranchReport } from "../../hooks/interfaces";
import { getAllReports } from "../../hooks/restAPIReport";

/**
 * Fungsi generatePDFReport untuk membuat laporan dalam bentuk PDF.
 * @param day Parameter untuk filter hari (bisa string/tanggal).
 * @param chartRefs Referensi chart (HTML element) yang akan dimasukkan ke dalam PDF.
 */
export const generatePDFReport = async (day: string, chartRefs?: React.RefObject<HTMLDivElement>) => {
  const doc = new jsPDF();

  const dataReal: AllReportsResponse = await getAllReports(day);

  const allDates: { raw: string; dateObj: Date }[] = [];

  Object.keys(dataReal.transactions_report).forEach((location) => {
    dataReal.transactions_report[location].forEach((item) => {
      const rawDate = item.date;
      const parts = rawDate.split(", ")[1];
      const dateObj = new Date(parts);
      allDates.push({ raw: rawDate, dateObj });
    });
  });

  allDates.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const startDate = allDates[0]?.raw || "-";
  const endDate = allDates[allDates.length - 1]?.raw || "-";

  // Header Utama
  doc.setFontSize(16);
  doc.text("Basreng POS Report", doc.internal.pageSize.getWidth() / 2, 15, {
    align: "center"
  });

  // ========== TABEL TRANSAKSI PER LOKASI ==========
  const locations = Object.keys(dataReal.transactions_report);
  locations.forEach((location, index) => {
    if (index > 0) doc.addPage();

    doc.setFontSize(12);
    doc.text(`${startDate} sampai ${endDate}`, doc.internal.pageSize.getWidth() / 2, 22, {
      align: "center"
    });
    doc.setFontSize(14);
    doc.text(`Laporan Cabang: ${location}`, 14, 30);

    const tableData = dataReal.transactions_report[location].map((item, index) => [
      index + 1,
      item.date,
      rupiahFormat(item.total_sales),
      item.total_transactions
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["No", "Tanggal", "Total Penjualan", "Total Transaksi"]],
      body: tableData
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "copyright@2025 Devon Yura App | Basreng POS",
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 10,
      { align: "center" }
    );
  });

  // ========== TABEL TOTAL PENJUALAN PER CABANG ==========
  doc.addPage();
  doc.setFontSize(14);
  doc.text(`Laporan Total Penjualan Per Cabang dari ${startDate} ke ${endDate}`, 14, 20);

  const branchTableData = dataReal.branch_report.map((branch: BranchReport) => [
    branch.branch_name,
    branch.total_transactions,
    rupiahFormat(branch.total_sales)
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Cabang", "Total Transaksi", "Total Penjualan"]],
    body: branchTableData
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "copyright@2025 Devon Yura App | Basreng POS",
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  // ========== TABEL SALES SEMUA PRODUK ==========
  doc.addPage();
  doc.setFontSize(14);
  doc.text(`Laporan Sales Semua Produk dari ${startDate} ke ${endDate}`, 14, 20);

  const productTableData = dataReal.product_sells_report.map((product, index) => [
    index + 1,
    product.product_name,
    product.total_sold,
    rupiahFormat(product.total_sales)
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["No", "Produk", "Total Qty", "Total Penjualan"]],
    body: productTableData
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "copyright@2025 Devon Yura App | Basreng POS",
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  // ========== CHART ==========
  if (chartRefs && chartRefs.current) {
    doc.addPage();

    // await waitForChartRendered(chartRefs.current)

    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      const chartWidth = chartRefs.current.offsetWidth;
      const chartHeight = chartRefs.current.offsetHeight;
      const aspectRatio = chartHeight / chartWidth;

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const targetWidth = pageWidth - margin * 2;
      const targetHeight = targetWidth * aspectRatio;

      const blob = await toBlob(chartRefs.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        style: { transformOrigin: "top left" },
        quality: 0.8
      });

      if (!blob) throw new Error("Gagal membuat blob dari chart.");

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((resolve) => {
        reader.onloadend = () => resolve(null);
      });

      const base64data = reader.result as string;
      const x = (pageWidth - targetWidth) / 2;
      const y = 20;
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // delay agar chart fully rendered

      doc.addImage(base64data, "JPEG", x, y, targetWidth, targetHeight, undefined, "FAST");
    } catch (error) {
      console.error("Gagal menangkap chart:", error);
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "copyright@2025 Devon Yura App | Basreng POS",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Retrun Doc
  return { doc, dataReal, startDate, endDate }

};

function waitForChartRendered(chartElement: any, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    function check() {
      if (chartElement.offsetHeight > 0) {
        resolve('');
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Chart render timeout"));
      } else {
        requestAnimationFrame(check);
      }
    }
    check();
  });
}

