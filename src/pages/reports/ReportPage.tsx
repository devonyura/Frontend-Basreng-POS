import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonDatetime,
  IonList,
  IonLoading
} from '@ionic/react';
import { useState, useRef } from 'react';
import { documentOutline, downloadOutline } from 'ionicons/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toBlob } from "html-to-image";
import { ChartRenderer } from "./ChartRenderer";
import { getAllReports } from '../../hooks/restAPIReport';
import { Transaction, AllReportsResponse, TransactionsReport, BranchReport, ProductSellsReport } from '../../hooks/interfaces';
import { rupiahFormat } from '../../hooks/formatting';
import { generatePDFReport } from "./GenerateReportPDF";
import { promise } from 'zod';

interface DataReal {
  transactions_report?: TransactionsReport | null | undefined;
  product_sells_report: ProductSellsReport[] | null | [];
}

const ReportPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);

  // for chart
  const chartRef = useRef<HTMLDivElement>(null);

  const [transactionReport, setTransactionReport] = useState<TransactionsReport>()
  const [productSellsReport, setProductSellsReport] = useState<ProductSellsReport[] | null | undefined>()

  const handleGenerate = async (range: string) => {
    setReportGenerated(false)
    setIsLoading(true)

    try {
      const dataChart = await getAllReports(range)
      setTransactionReport(dataChart.transactions_report)
      setProductSellsReport(dataChart.product_sells_report)

      const data = await generatePDFReport(range, chartRef); // tunggu proses generatePDFReport selesai

      setPdfDoc(data.doc)
      setIsLoading(false);
      setReportGenerated(true)

    } catch (error) {
      console.error("Gagal generate PDF:", error);
      // Tambahkan notifikasi error jika ingin
    } finally {
      setIsLoading(false);
    }
  };


  const downloadPDF = () => {
    if (pdfDoc) {
      pdfDoc.save("laporan_basreng_pos.pdf");
    }
  };

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleGenerateLast30Days = () => {
    // logika generate laporan 30 hari terakhir
    handleGenerate('30')
    console.log("Generate Laporan 30 Hari Terakhir");
  };

  const handleGenerateLast7Days = () => {
    // logika generate laporan 7 hari terakhir
    handleGenerate('7')
    console.log("Generate Laporan 7 Hari Terakhir");
  };

  const handleGenerateMonthly = () => {
    // logika generate laporan bulanan
    console.log(`Generate Laporan Bulan ${selectedMonth} Tahun ${selectedYear}`);
  };

  const handleGenerateDaily = () => {
    // logika generate laporan harian
    console.log(`Generate Laporan Hari ${selectedDate}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Halaman Laporan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* muncul jika proses generate pdf selsai (semua jenis laporan) */}
        {reportGenerated && (
          <>
            <IonItem lines="full">
              <IonLabel>
                <h2>Laporan Selesai dibuat!</h2>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonButton expand="block" size='default' onClick={downloadPDF} disabled={isLoading}>
                Download PDF!
              </IonButton>
            </IonItem>
          </>
        )}
        <IonList>
          <IonItem lines="full">
            <IonLabel>
              <h2>Laporan Harian</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            {/* <IonDatetime
              presentation="date"
              onIonChange={(e) => {
                const value = e.detail.value!;
                setSelectedDate(value);
              }}
            ></IonDatetime> */}
          </IonItem>
          <IonItem>
            <IonButton
              expand="block"
              disabled={!selectedDate}
              onClick={handleGenerateDaily}
            >
              Buat Laporan Hari {selectedDate}
            </IonButton>
          </IonItem>
          <IonItem lines="full">
            <IonLabel>
              <h2>Laporan -H</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={handleGenerateLast30Days}>
              Buat Laporan 30 Hari Terakhir
            </IonButton>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={handleGenerateLast7Days}>
              Buat Laporan 7 Hari Terakhir
            </IonButton>
          </IonItem>


          <IonItem lines="full">
            <IonLabel>
              <h2>Laporan Bulan Berjalan</h2>
            </IonLabel>
          </IonItem>
          <IonItem>
            {/* <IonDatetime
              presentation="month"
              onIonChange={(e) => {
                const value = e.detail.value!;
                const [year, month] = value.split("-");
                setSelectedYear(year);
                setSelectedMonth(month);
              }}
            ></IonDatetime> */}
          </IonItem>
          <IonItem>
            <IonButton
              expand="block"
              disabled={!selectedMonth || !selectedYear}
              onClick={handleGenerateMonthly}
            >
              Buat Laporan Bulan {selectedMonth} Tahun {selectedYear}
            </IonButton>
          </IonItem>


        </IonList>
        <ChartRenderer ref={chartRef}
          transactionsReport={transactionReport}
          productSellsReport={productSellsReport}
          setWidth={reportGenerated}
        />
        <IonLoading
          isOpen={isLoading}
          message={'Tunggu sebentar, laporan sedang dibuat...'}
          spinner="dots"
        />
      </IonContent>
    </IonPage>
  );
};

export default ReportPage;
