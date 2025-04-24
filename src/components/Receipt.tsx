import React, { useEffect, useState } from "react";
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItem } from "@ionic/react";
import { add, remove, trashBin } from "ionicons/icons";
import { rupiahFormat, generateReceiptNumber } from "../hooks/formatting";
import { DataProduct } from '../hooks/restAPIRequest'
import { useAuth } from "../hooks/useAuthCookie";
import "./Receipt.css"

interface ReceiptProps {
  // branch: string[];
  // cashierName: string;
  // receiptNumber: string;
  cash: number;
  change: number;
  total: number;
  isOnlineOrders: boolean;
  customerInfo: {
    name: string
    phone: string
    address: string
    notes: string
  }
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const Receipt: React.FC<ReceiptProps> = ({ cash, change, total, isOnlineOrders, customerInfo, cartItems }) => {
  // console.log("Change:", change);
  // console.log("Total:", total);

  // get Auth Data
  const { token, role, username, idUser, branchID } = useAuth()

  useEffect(() => {
    console.log("online Order:", isOnlineOrders)
  }, [isOnlineOrders])

  const receiptNoteNumber = generateReceiptNumber(Number(branchID), username)

  return (
    <div className='receipt-container'>
      <table className="receipt">
        <thead>
          <tr className='receipt-title'>
            <th colSpan={4}>- Basreng Ghosting Palu -</th>
          </tr>
          <tr>
            <th colSpan={4}><span></span></th>
          </tr>
          <tr>
            <th className="small-text" colSpan={3}>NO: {receiptNoteNumber}</th>
            <th>
              Kasir: {username}
            </th>
          </tr>
          <tr>
            <th colSpan={4}><span></span></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td className="small-text">{item.quantity}x</td>
              <td>{rupiahFormat(item.price, false)}</td>
              <td>{rupiahFormat((item.price * item.quantity), false)}</td>
            </tr>
          ))}
          <tr>
            <td className='tr-title' colSpan={3}>Total</td>
            <td className='tr-title'>{rupiahFormat(total, false)}</td>
          </tr>
          <tr>
            <td colSpan={3}>Tunai</td>
            <td>{rupiahFormat(cash, false)}</td>
          </tr>
          <tr>
            <td colSpan={3}>Kembalian</td>
            <td>{rupiahFormat(change, false)}</td>
          </tr>
          {isOnlineOrders && (
            <>
              <tr className='online-order-receipt tr-title '>
                <td colSpan={3} className='tr-title'>Pemesan</td>
                <td>{customerInfo.name}</td>
              </tr>
              <tr>
                <td colSpan={3} className='tr-title'>No WA/HP</td>
                <td>{customerInfo.phone}</td>
              </tr>
              <tr>
                <td colSpan={4} className='text-left tr-title'>ALamat:</td>
              </tr>
              <tr>
                <td colSpan={4} className='text-left'>{customerInfo.address}</td>
              </tr>
              <tr>
                <td colSpan={4} className='text-left tr-title'>Catatan Tambahan:</td>
              </tr>
              <tr>
                <td colSpan={4} className='text-left'>{customerInfo.notes}</td>
              </tr>
            </>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Tgl. 28-10-2025</td>
            <td>Ver.1.0.0</td>
          </tr>
          <tr>
            <td colSpan={4} className='info'>
              <p>- Basreng Ghosting Palu -</p>
              <p>- Berbagai cemilan pedas, mochi & sushi -</p>
              <p>- Jl.Masjid Raya (depan Masjid) -</p>
              <p>Selamat Menikmati :) </p>
              <p>PESANAN SUDAH DISTRUK TIDAK DAPAT DIUBAH</p>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <p><i>App by Devon Yura Software House</i></p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Receipt;
