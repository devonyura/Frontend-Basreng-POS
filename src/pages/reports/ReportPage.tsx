import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonAlert,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/react';
import { useState } from 'react';
import { documentOutline, downloadOutline } from 'ionicons/icons';

const ReportPage: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerate = async (range: string) => {
    setShowAlert(false);
    setIsLoading(true);

    // Simulasikan delay pembuatan laporan
    setTimeout(() => {
      setIsLoading(false);
      setReportGenerated(true);
    }, 2000); // 2 detik simulasi
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📄 Generate Laporan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!reportGenerated && (
          <IonButton expand="block" onClick={() => setShowAlert(true)}>
            Buat Laporan!
          </IonButton>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Pilih rentang laporan:"
          buttons={[
            {
              text: '30 Hari Terakhir',
              handler: () => handleGenerate('30'),
            },
            {
              text: '7 Hari Terakhir',
              handler: () => handleGenerate('7'),
            },
            {
              text: 'Hari Ini',
              handler: () => handleGenerate('1'),
            },
            {
              text: 'Batal',
              role: 'cancel',
            },
          ]}
        />

        <IonLoading
          isOpen={isLoading}
          message={'Tunggu sebentar, laporan sedang dibuat...'}
          spinner="dots"
        />

        {reportGenerated && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={documentOutline} /> Laporan Siap!
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Pratinjau laporan tersedia di bawah ini.</p>
              <div style={{ border: '1px solid #ccc', height: '200px', marginTop: '10px' }}>
                <em>(Preview file laporan PDF di sini)</em>
              </div>
              <IonButton expand="block" color="success" className="ion-margin-top">
                <IonIcon icon={downloadOutline} slot="start" />
                Unduh PDF
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ReportPage;
