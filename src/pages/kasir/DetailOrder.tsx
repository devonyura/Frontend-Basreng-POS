import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonSegment,
  IonToast,
  IonText,
  IonIcon,
  IonLabel,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonModal, IonBadge,
  IonItemDivider, IonList, IonSelect, IonSelectOption,
  IonCheckbox, IonButtons,
  IonTextarea,
  IonItemGroup
} from '@ionic/react';
import { add, remove, trashBin, cart } from 'ionicons/icons';

import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { loginRequest } from '../../hooks/restAPIRequest';
import { useAuth } from "../../hooks/useAuthCookie";
import AlertInfo, { AlertState } from "../../components/AlertInfo";
import "./DetailOrder.css";
import { OverlayEventDetail } from '@ionic/core/components';
import qrcode from "../../../public/img/qr/images.png"

const DetailOrder: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const paymentModal = useRef<HTMLIonModalElement>(null);
  // const input = useRef<HTMLIonInputElement>(null);



  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    // if (event.detail.role === 'confirm') {
    //   setMessage(`Hello, ${event.detail.data}!`);
    // }
  }

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed" color="danger">
        <IonBadge color="danger">1</IonBadge>
        <IonFabButton id='open-detail-order'>
          <IonIcon icon={cart} />
        </IonFabButton>
      </IonFab>
      <IonModal ref={modal} trigger="open-detail-order" onWillDismiss={(event) => onWillDismiss(event)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Kembali</IonButton>
            </IonButtons>
            <IonTitle>Detail Order</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol className='img-card'>
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                </IonCol>
                <IonCol size="7">
                  <div className='amount title'>
                    <b>Sushi All Variant</b>
                  </div>
                  <div className='amount subtotal'>
                    <p>Subtotal : <b>Rp.60.000</b></p>
                  </div>
                  <div className='amount'>
                    <p>Qty:</p>
                    <IonButton shape="round" size='default'>
                      <IonIcon slot="icon-only" icon={remove}></IonIcon>
                    </IonButton>
                    0
                    <IonButton shape="round" size='default'>
                      <IonIcon slot="icon-only" icon={add}></IonIcon>
                    </IonButton>
                  </div>
                </IonCol>
                <IonCol class='col-trash'>
                  <IonButton shape="round" color={'danger'} size='default'>
                    <IonIcon slot="icon-only" icon={trashBin}></IonIcon>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol className='img-card'>
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                </IonCol>
                <IonCol size="7">
                  <div className='amount title'>
                    <b>Sushi All Variant</b>
                  </div>
                  <div className='amount subtotal'>
                    <p>Subtotal : <b>Rp.60.000</b></p>
                  </div>
                  <div className='amount'>
                    <p>Qty:</p>
                    <IonButton shape="round" size='default'>
                      <IonIcon slot="icon-only" icon={remove}></IonIcon>
                    </IonButton>
                    0
                    <IonButton shape="round" size='default'>
                      <IonIcon slot="icon-only" icon={add}></IonIcon>
                    </IonButton>
                  </div>
                </IonCol>
                <IonCol class='col-trash'>
                  <IonButton shape="round" color={'danger'} size='default'>
                    <IonIcon slot="icon-only" icon={trashBin}></IonIcon>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <div className="input-method">
            <IonList>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol size='9'>
                      <IonSelect label="Pembayaran:">
                        <IonSelectOption value="apple">Cash</IonSelectOption>
                        <IonSelectOption value="banana">QRIS</IonSelectOption>
                        <IonSelectOption value="orange">TRANSFER BANK BRI</IonSelectOption>
                      </IonSelect>
                    </IonCol>
                    <IonCol class='flex-center qr-method'>
                      <IonButton id='open-payment-method' expand='full'>QR</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>

              </IonItem>
              <IonItem>
                <IonCheckbox>Uang Pas</IonCheckbox>
              </IonItem>
              <div className="cash">
                <IonItem>
                  <IonInput label="Masukkan Cash:"></IonInput>
                </IonItem>
                <IonItem>
                  <IonButton color={"primary"} size='small'>15K</IonButton>
                  <IonButton color={"success"} size='small'>20K</IonButton>
                  <IonButton color={"success"} size='small'>30K</IonButton>
                  <IonButton color={"secondary"} size='small'>50K</IonButton>
                  <IonButton color={"danger"} size='small'>100K</IonButton>
                </IonItem>
              </div>
              <IonItem>
                <IonCheckbox id='online-check'>Pesanan Online?</IonCheckbox>
              </IonItem>
              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel>Info Pemesan</IonLabel>
                </IonItemDivider>
                <IonItem>
                  <IonInput type='text' placeholder='isi Nama Pemesan'></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput type='text' placeholder='Nomor WA/HP Pemesan'></IonInput>
                </IonItem>
                <IonItem>
                  <IonTextarea placeholder='Catatan: contoh: Pesanan dibayar 50K' autoGrow={true}></IonTextarea>
                </IonItem>
                <IonItem className='button-wrapper'>
                  <IonButton expand='block' size='small' color={'dark'}>Salin Info Pemesan (Untuk Order Maxim)</IonButton>
                </IonItem>
              </IonItemGroup>
            </IonList>
          </div>
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
          <IonButton expand="block" className='btn-checkout'>Selesaikan Transaksi</IonButton>
          <div className='space'></div>
        </IonContent>
        <IonModal ref={paymentModal} trigger="open-payment-method" initialBreakpoint={0.75} breakpoints={[0.75, 1]}>
          <div className="payment-method" onClick={() => paymentModal.current?.setCurrentBreakpoint(1)} >
            {/* <div className='transfer-bank'>
              <p>Transfer ke No Rek Dibawah ini:</p>
              <h2>BRI: 1209302933012930</h2>
              <h3>NAMA: SYAKIRAH DELTA SALSABILA</h3>
              <h4><b>TOTAL BAYAR: Rp.45.000</b></h4>
            </div> */}
            <div className='QRIS'>
              <p>Scan QR dibawah ini untuk membayar:</p>
              <h2><img src={qrcode} alt="" /></h2>
              <h3>BASRENG GHOSTING PLW</h3>
              <h4><b>TOTAL BAYAR: Rp.45.000</b></h4>
            </div>
          </div>
        </IonModal>
      </IonModal>

    </>
  )
};

export default DetailOrder;
