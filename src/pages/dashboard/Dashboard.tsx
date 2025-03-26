import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonIcon,
  IonLabel,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol, IonGrid, IonRow,
  IonSearchbar,
  IonList, IonItem,
  IonModal,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonAlert
} from '@ionic/react';
import { exitOutline, statsChart } from 'ionicons/icons';

import { useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { loginRequest } from '../../hooks/restAPIRequest';
import { useAuth } from "../../hooks/useAuthCookie";
import AlertInfo, { AlertState } from "../../components/AlertInfo";
import "./Dashboard.css";

interface LocationState {
  isTokenExpired?: boolean;
  dontRefresh?: boolean;
}

const Dashboard: React.FC = () => {
  const modalDetail = useRef<HTMLIonModalElement>(null);

  // setup Alert
  const [alert, setAlert] = useState<AlertState>({
    showAlert: false,
    header: '',
    alertMesage: '',
    hideButton: false,
  });

  const { login, logout, token, role } = useAuth();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [isTokenExpired, setIsTokenExpired] = useState(location.state?.isTokenExpired || false);
  const [showLogoutAlert, setLogoutShowAlert] = useState(false);


  const handleLogout = () => {
    logout();
  }

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <IonButton onClick={() => setLogoutShowAlert(true)} expand='block'>
            <IonIcon icon={exitOutline} slot='start' />
            Keluar
          </IonButton>
        </IonContent>
      </IonMenu>
      <IonPage id='main-content'>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonGrid>
              <IonRow>
                <IonCol className='icon-card'>
                  <IonIcon icon={statsChart}></IonIcon>
                </IonCol>
                <IonCol size="8">
                  <IonCardHeader>
                    <IonCardTitle>Transaksi Hari Ini:</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className='details-card'>
                      <h5>Cabang: Semua cabang</h5>
                      <h2>Rp.1.000.999</h2>
                      <h4>Dari 999 Transaksi</h4>
                    </div>
                  </IonCardContent>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
        </IonContent>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setLogoutShowAlert(false)}
          header="Konfirmasi"
          message="Yakin ingin Logout akun?"
          buttons={[
            {
              text: "Batal",
              role: "cancel",
            },
            {
              text: "Keluar",
              handler: handleLogout,
            },
          ]}
        />

        <AlertInfo
          isOpen={alert.showAlert}
          header={alert.header}
          message={alert.alertMesage}
          onDidDismiss={() => setAlert(prevState => ({ ...prevState, showAlert: false }))}
          hideButton={alert.hideButton}
        />
      </IonPage>
    </>
  )
};

export default Dashboard;
