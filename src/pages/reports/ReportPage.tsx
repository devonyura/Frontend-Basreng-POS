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
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/react';
import { useState, useRef } from 'react';
import { documentOutline, downloadOutline } from 'ionicons/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toBlob } from "html-to-image";
import { ChartRenderer } from "./ChartRenderer";
import { getAllReports, getDetailReport } from '../../hooks/restAPIReport';
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
  const [isDayReport, setIsDayReport] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);

  // for chart
  const chartRef = useRef<HTMLDivElement>(null);
  const [isChartWidth, setIsChartWidth] = useState(false);

  // data
  const [transactionReport, setTransactionReport] = useState<TransactionsReport>()
  const [productSellsReport, setProductSellsReport] = useState<ProductSellsReport[] | null | undefined>()

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fungsi handleGenerate
  const handleGenerate = async (dayInput: string = '', monthInput: string = '', yearInput: string = '', isDayReportProp: boolean = false) => {
    setIsChartWidth(false);
    setIsLoading(true);

    try {
      let dataChart
      if (isDayReportProp) {
        setIsDayReport(true)
        dataChart = await getDetailReport(dayInput);
      } else {
        dataChart = await getAllReports(dayInput, monthInput, yearInput);
      }

      // Cek data kosong
      const isEmptyData =
        (dataChart.transactions_report?.length ?? 0) === 0 &&
        (dataChart.product_sells_report?.length ?? 0) === 0 &&
        (dataChart.branch_report?.length ?? 0) === 0;

      if (isEmptyData) {
        setAlertMessage(`Laporan pada ${dayInput || '...'}-${monthInput || '...'}-${yearInput || '...'} tidak ada.`);
        setShowAlert(true);
        setIsLoading(false);
        return; // Stop proses generate
      }

      // Jika data ada, lanjutkan proses
      setTransactionReport(dataChart.transactions_report);
      setProductSellsReport(dataChart.product_sells_report);

      const data = await generatePDFReport(dayInput, monthInput, yearInput, chartRef, isDayReportProp);
      setPdfDoc(data.doc);

      setIsChartWidth(true);

      setShowDownloadAlert(true)
      setAlertMessage(`Silahkan Unduh Laporan dengan klik tombol dibawah`)
    } catch (error) {
      console.error("Gagal generate PDF:", error);
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
    handleGenerate('', selectedMonth, selectedYear)

    console.log(`Generate Laporan Bulan ${selectedMonth} Tahun ${selectedYear}`);
  };

  const handleGenerateDaily = () => {

    console.log(`Generate Laporan Hari ${selectedDate}`);
    handleGenerate(selectedDate, '', '', true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Halaman Laporan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonAccordionGroup expand="compact">
          <IonAccordion value="daily">
            <IonItem slot="header" lines="full">
              <IonLabel>
                <h2>Laporan Harian</h2>
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonItem>
                <IonDatetime
                  presentation="date"
                  onIonChange={(e) => {
                    const value = e.detail.value!;
                    if (value && typeof value === "string") {
                      const selectedDateOnly = value ? value.split("T")[0] : '';
                      setSelectedDate(selectedDateOnly);
                    }
                  }}
                />
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
            </div>
          </IonAccordion>

          <IonAccordion value="last-days">
            <IonItem slot="header" lines="full">
              <IonLabel>
                <h2>Laporan -H</h2>
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
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
            </div>
          </IonAccordion>

          <IonAccordion value="monthly">
            <IonItem slot="header" lines="full">
              <IonLabel>
                <h2>Laporan Bulanan</h2>
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonItem>
                <IonDatetime
                  presentation="month"
                  onIonChange={(e) => {
                    const value = e.detail.value;
                    if (value && typeof value === "string") {
                      const [year, month] = value.split("-");
                      setSelectedYear(year);
                      setSelectedMonth(month);
                    }
                  }}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Tahun</IonLabel>
                <IonSelect
                  value={selectedYear}
                  placeholder="Pilih Tahun"
                  onIonChange={(e) => {
                    const value = e.detail.value;
                    setSelectedYear(value);
                  }}
                >
                  {Array.from({ length: 5 }, (_, idx) => {
                    const year = new Date().getFullYear() - idx;
                    return (
                      <IonSelectOption key={year} value={year.toString()}>
                        {year}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
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
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        <ChartRenderer ref={chartRef}
          transactionsReport={transactionReport}
          productSellsReport={productSellsReport}
          setWidth={isChartWidth}
          isDayReport={isDayReport}
        />
        <IonLoading
          isOpen={isLoading}
          message={'Tunggu sebentar, laporan sedang dibuat...'}
          spinner="dots"
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Informasi"
          message={alertMessage}
          buttons={['OK']}
        />
        <IonAlert
          isOpen={showDownloadAlert}
          onDidDismiss={() => setShowDownloadAlert(false)}
          header="Laporan Selesai Dibuat!"
          message={alertMessage}
          buttons={[
            {
              text: 'Kembali',
              role: 'cancel',
              handler: () => setShowDownloadAlert(false)
            },
            {
              text: 'Download',
              handler: downloadPDF
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReportPage;
