import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonLabel,
  IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonModal, IonBadge,
  IonItemDivider, IonList, IonSelect, IonSelectOption,
  IonCheckbox, IonButtons,
  IonTextarea,
  IonItemGroup,
} from '@ionic/react';
import { cart } from 'ionicons/icons';

import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { loginRequest, getBranch, TransactionPayload, createTransaction } from '../../hooks/restAPIRequest';
import { useAuth } from "../../hooks/useAuthCookie";
import AlertInfo, { AlertState } from "../../components/AlertInfo";
import "./DetailOrder.css";
import { OverlayEventDetail } from '@ionic/core/components';
import qrcode from "../../../public/img/qr/images.png"
import Receipt, { BranchData } from "../../components/Receipt";

// Redux
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import ProductCartItem from '../../components/ProductCartItem';
import { selectorCartTotal } from "../../redux/cartSelectors";

import { rupiahFormat, calculateChange, generateReceiptNumber } from '../../hooks/formatting';
import React from 'react';

const DetailOrder: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const paymentModal = useRef<HTMLIonModalElement>(null);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isCash, setIsCash] = useState(false);
  const [isOnlineOrder, setIsOnlineOrder] = useState(false);

  // Form
  const [cashGiven, setCashGiven] = useState<number | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const total: any = useSelector(selectorCartTotal)

  let change = calculateChange(Number(cashGiven), total)

  const { username, branchID, idUser } = useAuth()
  const receiptNoteNumber = generateReceiptNumber(Number(branchID), username)
  const buttonColorCash = ["success", "warning", "secondary", "danger"]

  useEffect(() => {

    if (isCash) {
      setCashGiven(total)
    } else {
      setCashGiven(null)
    }

  }, [isCash])


  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {

  }

  const [branchDataState, setBranchDataState] = useState<BranchData | null>(null)

  useEffect(() => {

    const fetchBranch = async () => {
      try {
        const data = await getBranch(Number(branchID));
        setBranchDataState(data);
        console.log(branchDataState)
      } catch (err) {
        console.error("Gagal load branch info:", err);
      }
    }

    fetchBranch()
  }, [])

  const handleSubmitTransaction = async () => {
    if (!branchDataState) {
      console.warn("Branch belum dimuat.");
      return;
    }

    const dateTimeNow = new Date();
    const formattedDateTime = dateTimeNow.toISOString().replace("T", " ").substring(0, 19); // format: yyyy-MM-dd HH:mm:ss

    const cash_amounts = isCash ? total : cashGiven ?? 0;

    const transactionData: TransactionPayload = {
      transaction: {
        transaction_code: generateReceiptNumber(Number(branchID), username),
        user_id: Number(idUser),
        branch_id: Number(branchID),
        date_time: formattedDateTime,
        total_price: total,
        cash_amount: cash_amounts,
        change_amount: change,
        payment_method: paymentMethod,
        is_online_order: isOnlineOrder === true ? 1 : 0,
        customer_name: customerInfo.name === "" ? null : customerInfo.name,
        customer_phone: customerInfo.phone === "" ? null : customerInfo.phone,
        customer_address: customerInfo.address === "" ? null : customerInfo.name,
        notes: customerInfo.notes === "" ? null : customerInfo.notes
      },

      transaction_details: cartItems.map(item => ({
        product_id: Number(item.id), // pastikan item.id adalah ID produk asli dari DB
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }))
    }

    console.log("Data Transaksi Siap Dikirim:", transactionData);

    // setAlert({
    //       showAlert: true,
    //       header: "Sedang menyimpan",
    //       alertMesage: "Tunggu Sebentar...",
    //       hideButton: true,
    //     });

    //     const newStudent = { name, address, gender }

    // if (!checkForm("Nama", newStudent.name)) {
    //   return
    // }
    // if (!checkForm("Alamat", newStudent.address)) {
    //   return
    // }

    try {

      const result = await createTransaction(transactionData)

      if (result.success) {
        // resetForm();
        // setAlert({
        //   showAlert: true,
        //   header: "Berhasil",
        //   alertMesage: "Data Murid ditambahkan."
        // });

        // history.push('/student-list')
        console.log("Transaksi Berhasil Dicatat!", result)
      } else {
        // setAlert({
        //   showAlert: true,
        //   header: "Gagal!",
        //   alertMesage: result.error
        // });
        console.log("Transaksi Gagal Dicatat: ", result)
      }

    } catch (error: any) {
      console.log("Transaksi Gagal Dicatat: ", error)
      // setAlert({
      //   showAlert: true,
      //   header: "Kasalahan Server!",
      //   alertMesage: error.error
      // });
    }
  }



  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed" color="danger">
        {(cartItems.length !== 0) && (
          <IonBadge color="danger">{cartItems.length}</IonBadge>
        )}
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
          {cartItems.map((product) => (
            <ProductCartItem key={product.id} product={product} />
          ))}

          <div className="input-method">
            <IonList>
              <IonItem>
                <IonInput label="Total Belanja:" value={rupiahFormat(total)} disabled={true}></IonInput>
              </IonItem>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol size='9'>
                      <IonSelect
                        name='payment_method'
                        label="Pembayaran:"
                        value={paymentMethod}
                        onIonChange={(e) => setPaymentMethod(e.detail.value)}
                      >
                        <IonSelectOption value="cash">Cash</IonSelectOption>
                        <IonSelectOption value="qris">QRIS</IonSelectOption>
                        <IonSelectOption value="transfer_bank">TRANSFER BANK</IonSelectOption>
                      </IonSelect>
                    </IonCol>
                    <IonCol
                      className={`flex-center qr-method ${paymentMethod === "qris" || paymentMethod === "transfer_bank"
                        ? ""
                        : "hidden-button"
                        }`}
                    >
                      <IonButton id='open-payment-method' expand='full'>
                        {paymentMethod === "qris" ? "QR" : "TF"}
                      </IonButton>
                    </IonCol>

                  </IonRow>
                </IonGrid>
              </IonItem>
              <IonItem>
                <IonCheckbox checked={isCash} onIonChange={(e) => setIsCash(e.detail.checked)}>Uang Pas</IonCheckbox>
              </IonItem>
              <div className={`cash ${isCash ? "hidden-button" : ""}`} >
                <IonItem>
                  <IonInput type="number" label="Masukkan Cash:" value={cashGiven ?? ''} onIonChange={e => setCashGiven(parseInt(e.detail.value!, 10))}></IonInput>
                </IonItem>
                <IonItem>
                  {[20000, 30000, 50000, 100000].map((nominal, key) => (
                    <IonButton key={nominal} color={buttonColorCash[key]} size='small' onClick={() => setCashGiven(nominal)}>{rupiahFormat(nominal)}</IonButton>
                  ))}
                </IonItem>
                <IonItem>
                  <IonInput label="Kembalian:" value={rupiahFormat(change)} disabled></IonInput>
                </IonItem>
              </div>
              <IonItem>
                <IonCheckbox id='online-check' checked={isOnlineOrder} onIonChange={(e) => setIsOnlineOrder(e.detail.checked)}>Pesanan Online?</IonCheckbox>
              </IonItem>
              <IonItemGroup className={!isOnlineOrder ? "hidden-button" : ''}>
                <IonItemDivider>
                  <IonLabel>Info Pemesan</IonLabel>
                </IonItemDivider>
                <IonItem>
                  <IonInput name='customer_name' type='text' placeholder='isi Nama Pemesan' value={customerInfo.name} onIonChange={(e) => setCustomerInfo({ ...customerInfo, name: e.detail.value! })}></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput name='customer_phone' type='text' placeholder='Nomor WA/HP Pemesan' value={customerInfo.phone} onIonChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.detail.value! })}></IonInput>
                </IonItem>
                <IonItem>
                  <IonTextarea name='customer_address' labelPlacement="stacked" placeholder="Alamat Pemasan" value={customerInfo.address} onIonChange={(e) => setCustomerInfo({ ...customerInfo, address: e.detail.value! })}></IonTextarea>
                </IonItem>
                <IonItem>
                  <IonTextarea name='notes' placeholder='Catatan: contoh: Pesanan dibayar 50K' autoGrow={true} value={customerInfo.notes} onIonChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.detail.value! })}></IonTextarea>
                </IonItem>
                <IonItem className='button-wrapper'>
                  <IonButton expand='block' size='small' color={'dark'}>Salin Info Pemesan (Untuk Order Maxim)</IonButton>
                </IonItem>
              </IonItemGroup>
            </IonList>
          </div>
          <Receipt
            cash={Number(cashGiven)}
            change={change}
            total={total}
            isOnlineOrders={isOnlineOrder}
            customerInfo={customerInfo}
            cartItems={cartItems}
            receiptNoteNumber={receiptNoteNumber}
            branchData={branchDataState}
          >

          </Receipt>
          <IonButton expand="block" className='btn-checkout' color="success" onClick={handleSubmitTransaction}>Selesaikan Transaksi</IonButton>
          <div className='space'></div>
        </IonContent>
        <IonModal
          ref={paymentModal}
          trigger="open-payment-method"
          initialBreakpoint={0.75}
          breakpoints={[0.75, 1]}
        >
          <div className="payment-method" onClick={() => paymentModal.current?.setCurrentBreakpoint(1)} >
            {paymentMethod === "transfer_bank" && (
              <div className='transfer-bank'>
                <p>Transfer ke No Rek Dibawah ini:</p>
                <h2>BRI: 1209302933012930</h2>
                <h3>NAMA: SYAKIRAH DELTA SALSABILA</h3>
                <h4><b>TOTAL BAYAR: {rupiahFormat(total)}</b></h4>
              </div>
            )}

            {paymentMethod === "qris" && (
              <div className='QRIS'>
                <p>Scan QR dibawah ini untuk membayar:</p>
                <h2><img src={qrcode} alt="" /></h2>
                <h4><b>TOTAL BAYAR: {rupiahFormat(total)}</b></h4>
                <h3>BASRENG GHOSTING PLW</h3>
              </div>
            )}
          </div>
        </IonModal>
      </IonModal>

    </>
  )
};

export default DetailOrder;
