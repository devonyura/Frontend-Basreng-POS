import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonIcon } from "@ionic/react";
import { add, remove, trashBin } from "ionicons/icons";
import { rupiahFormat } from "../hooks/formatting";
import { DataProduct } from '../hooks/restAPIRequest'

interface ProductCardProps {
  product: DataProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <IonCard>
      <IonGrid>
        <IonRow>
          <IonCol className="img-card">
            <img alt={product.name} src="https://ionicframework.com/docs/img/demos/card-media.png" />
          </IonCol>
          <IonCol size="8">
            <IonCardHeader>
              <IonCardTitle>{product.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="amount price">
                <p>Harga: <span>{rupiahFormat(product.price)}</span></p>
              </div>
              <div className="amount">
                <p>Qty:</p>
                <IonButton shape="round" size="small">
                  <IonIcon slot="icon-only" icon={remove}></IonIcon>
                </IonButton>
                0
                <IonButton shape="round" size="small">
                  <IonIcon slot="icon-only" icon={add}></IonIcon>
                </IonButton>
                <IonButton shape="round" size="small" color="danger">
                  <IonIcon slot="icon-only" icon={trashBin}></IonIcon>
                </IonButton>
              </div>
              <div className="amount">
                <IonButton shape="round" size="small">3</IonButton>
                <IonButton shape="round" size="small">6</IonButton>
                <IonButton shape="round" size="small">12</IonButton>
              </div>
              <div className="amount price">
                <p>Subtotal: <span>{rupiahFormat("60000.00")}</span></p>
              </div>
            </IonCardContent>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default ProductCard;
