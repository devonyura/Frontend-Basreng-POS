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
  IonItemOptions
} from '@ionic/react';
import { add, remove, trashBin, arrowDownCircleOutline, information, informationCircleOutline, informationCircle } from 'ionicons/icons';

import { useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
// import { loginRequest } from '../../hooks/restAPIRequest';
// import { useAuth } from "../../hooks/useAuthCookie";
import AlertInfo, { AlertState } from "../../components/AlertInfo";
import "./TransactionHistory.css";

interface LocationState {
  isTokenExpired?: boolean;
  dontRefresh?: boolean;
}

const TransactionHistory: React.FC = () => {
  const modalDetail = useRef<HTMLIonModalElement>(null);

  // setup Alert
  const [alert, setAlert] = useState<AlertState>({
    showAlert: false,
    header: '',
    alertMesage: '',
    hideButton: false,
  });

  // const { login, token, role } = useAuth();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [isTokenExpired, setIsTokenExpired] = useState(location.state?.isTokenExpired || false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Riwayat Transaksi
          </IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder='Cari Transaksi'></IonSearchbar>
        </IonToolbar>
        <IonToolbar className='filter-container'>
          <IonButton size='small' color="medium">
            {/* <IonIcon icon={arrowDownCircleOutline} slot='end'></IonIcon> */}
            Urutkan dari : <span>Terbaru</span>
          </IonButton>
          <IonButton size='small' color="medium">
            {/* <IonIcon icon={arrowDownCircleOutline} slot='end'></IonIcon> */}
            Waktu : <span>1-12 Maret 2025</span>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItemSliding>
            <IonItem>
              <IonLabel color='medium'><span>1.</span> Hari ini pukul 10:15 | Total: Rp.12.000 </IonLabel>
              {/* <IonButton  color="secondary">Rincian</IonButton> */}
            </IonItem>
            <IonItemOptions>
              <IonItemOption id="open-detail-transaction" color="secondary">
                <IonIcon slot='start' icon={informationCircle}></IonIcon>
                Rincian
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>

        </IonList>
        <IonModal ref={modalDetail} trigger="open-detail-transaction" initialBreakpoint={1} breakpoints={[0, 1]}>
          <div className='receipt-container'>
            <table className="receipt">
              <thead>
                <tr className='receipt-title'>
                  <th colSpan={3}>- Basreng Ghosting Palu -</th>
                </tr>
                <tr>
                  <th colSpan={3}><span></span></th>
                </tr>
                <tr>
                  <th colSpan={2}>NO: CA01.03.25.10.15.12</th>
                  <th>
                    Kasir: Dina
                  </th>
                </tr>
                <tr>
                  <th colSpan={3}><span></span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mochi All Variant</td>
                  <td>10x</td>
                  <td>Rp.25.000</td>
                </tr>
                <tr>
                  <td>Basreng 75g</td>
                  <td>2x</td>
                  <td>Rp.20.000</td>
                </tr>
                <tr>
                  <td>Total Item</td>
                  <td>x12</td>
                  <td>Rp.45.000</td>
                </tr>
                <tr>
                  <td colSpan={2}>Tunai</td>
                  <td>Rp.100.000</td>
                </tr>
                <tr>
                  <td colSpan={2}>Kembalian</td>
                  <td>Rp.55.000</td>
                </tr>
                <tr className='online-order-receipt tr-title'>
                  <td colSpan={2} className='tr-title'>Pemesan</td>
                  <td>Auliya</td>
                </tr>
                <tr>
                  <td colSpan={2} className='tr-title'>No WA/HP</td>
                  <td>085757063969</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-left tr-title'>ALamat:</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-left'>Jl. Nuri no.19 (Depan masjid at-takwa)</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-left tr-title'>Catatan Tambahan:</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-left'>Pesanan Dibayar 50K</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Tgl. 28-10-2025</td>
                  <td>Ver.1.0.0</td>
                </tr>
                <tr>
                  <td colSpan={3} className='info'>
                    <p>- Basreng Ghosting Palu -</p>
                    <p>- Berbagai cemilan pedas, mochi & sushi -</p>
                    <p>- Jl.Masjid Raya (depan Masjid) -</p>
                    <p>- Jl.Veteran (dekat ....) -</p>
                    <p>Selamat Menikmati :) </p>
                    <p>PESANAN SUDAH DISTRUK TIDAK DAPAT DIUBAH</p>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <p><i>App by Devon Yura Software House</i></p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </IonModal>
      </IonContent>

      <AlertInfo
        isOpen={alert.showAlert}
        header={alert.header}
        message={alert.alertMesage}
        onDidDismiss={() => setAlert(prevState => ({ ...prevState, showAlert: false }))}
        hideButton={alert.hideButton}
      />
    </IonPage>
  )
};

export default TransactionHistory;
