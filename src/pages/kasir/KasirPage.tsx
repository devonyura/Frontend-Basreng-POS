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
  useIonViewWillEnter,
  IonAccordion, IonAccordionGroup, IonItem
} from '@ionic/react';

import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// hooks
import { getDataProducts, DataProduct } from '../../hooks/restAPIRequest'
import { useAuth } from "../../hooks/useAuthCookie";

// components
import AlertInfo, { AlertState } from "../../components/AlertInfo";
import DetailOrder from "./DetailOrder";
import ProductCard from "../../components/ProductCard";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import { RootState, AppDispatch } from "../../redux/store"

// styling
import "./KasirPage.css";

const KasirPage: React.FC = () => {

  // ===== setup Alert
  const [alert, setAlert] = useState<AlertState>({
    showAlert: false,
    header: '',
    alertMesage: '',
    hideButton: false,
  });

  // ===== Setup Auth
  const { token, role } = useAuth();
  const history = useHistory();

  // Redirect if token expired/wrong
  useEffect(() => {
    if (token === null && role === null) {
      history.replace("/login", { isTokenExpired: true });
    }
  }, [token, role, history]);

  // ===== states
  // const [products, setProducts] = useState<DataProduct[]>([]);
  const [isRefresh, setIsRefresh] = useState(true);

  // ===== functions/method 
  // const fetchProducts = useCallback(async () => {

  //   const getData: any = await getDataProducts(setProducts);

  //   if (getData !== undefined) {
  //     setAlert({
  //       showAlert: true,
  //       header: `Kasalahan Server!`,
  //       alertMesage: getData
  //     });
  //   }

  // }, [])

  // ===== uses

  const { products, isLoading, error } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch<AppDispatch>();

  // Jalankan fetchProducts saat pertama kali komponen dimuat
  useIonViewWillEnter(() => {
    setIsRefresh(false);
    dispatch(fetchProducts());
  }, [dispatch])

  useEffect(() => {
    if (isRefresh) {
      setIsRefresh(false)
    }
    if (error) {
      setAlert({
        showAlert: true,
        header: "Peringatan",
        alertMesage: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
      });
    }
  }, [isRefresh])

  console.log(products);
  console.log(error);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Kasir Panel
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>
          Pilih Item yang akan dibeli:
        </h2>

        <IonSegment>
          <IonSegmentButton value="1" contentId="1">
            <IonLabel>Cemilan</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="2" contentId="2">
            <IonLabel>Mochi</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="3" contentId="3">
            <IonLabel>Sushi</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonSegmentView>

          <IonSegmentContent id="1">
            <IonAccordionGroup>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Basreng</IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  {products
                    .filter((product) => product.category_id === "1" && product.name.toLowerCase().includes("basreng"))
                    .map((product) => (
                      <ProductCard product={product} key={product.id} />
                    ))}
                </div>
              </IonAccordion>
              <IonAccordion value="second">
                <IonItem slot="header" color="light">
                  <IonLabel>Cimol</IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  {products
                    .filter((product) => product.category_id === "1" && product.name.toLowerCase().includes("cimol"))
                    .map((product) => (
                      <ProductCard product={product} key={product.id} />
                    ))}
                </div>
              </IonAccordion>
              <IonAccordion value="third">
                <IonItem slot="header" color="light">
                  <IonLabel>Kripik Kaca</IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  {products
                    .filter((product) => product.category_id === "1" && product.name.toLowerCase().includes("kripca"))
                    .map((product) => (
                      <ProductCard product={product} key={product.id} />
                    ))}
                </div>
              </IonAccordion>
            </IonAccordionGroup>

          </IonSegmentContent>
          <IonSegmentContent id="2">
            {products
              .filter((product) => product.category_id === "2")
              .map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
          </IonSegmentContent>
          <IonSegmentContent id="3">
            {products
              .filter((product) => product.category_id === "3")
              .map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
          </IonSegmentContent>
        </IonSegmentView>

        {/* Detail Order Component */}
        <DetailOrder />
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

export default KasirPage;
