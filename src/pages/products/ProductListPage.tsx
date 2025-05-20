// ProductListPage.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonAlert
} from '@ionic/react';
import { pencil, trashBin } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getProducts, Product, deleteProduct } from '../../hooks/restAPIProducts';
import ProductForm, { AlertMessageProps } from './ProductForm';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)

  const [showAlert, setShowAlert] = useState(false)
  const [alertMesage, setAlertMesage] = useState<AlertMessageProps>({ title: '', message: '' })

  const handleSuccess = (info: string = "Ditambah") => {
    // refresh data jika perlu
    info = editingProduct ? "Diubah" : "Ditambah"
    setShowModal(false)
    fetchProducts()
    setShowAlert(true)
    setAlertMesage({ title: 'Berhasil', message: `Produk Berhasil ${info}!` })
    setEditingProduct(null)
    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Gagal mengambil data produk:", err);
    } finally {
      setLoading(false);
    }
  };

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    console.log("Edit:", product);
    let price = product.price.toString().split('.')
    product.price = price[0]
    setEditingProduct(product)
    setShowModal(true)
  };

  const handleAdd = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const [showConfirmBeforeDelete, setShowConfirmBeforeDelete] = useState(false)
  const [id, setId] = useState('')

  // Tambahkan di dalam komponen
  const handleDelete = async () => {
    setShowConfirmBeforeDelete(true)
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Data Barang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={handleAdd}>Tambah Barang</IonButton>

        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <IonList>
            {products.map(product => (
              <IonItem key={product.id}>
                <IonLabel>
                  <h2>{product.name}</h2>
                  <p>Harga: Rp {parseInt(product.price).toLocaleString()}</p>
                </IonLabel>
                <IonButton fill="clear" slot="end" onClick={() => handleEdit(product)}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" color="danger" slot="end" onClick={() => { setId(product.id); handleDelete() }}>
                  <IonIcon icon={trashBin} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
        <ProductForm
          isOpen={showModal}
          onDidDismiss={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          initialProduct={editingProduct}
          onSuccess={() => {
            handleSuccess()
          }
          }
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertMesage.title}
          message={alertMesage.message}
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
        <IonAlert
          isOpen={showConfirmBeforeDelete}
          onDidDismiss={() => { }}
          header="Hapus Produk?"
          message={
            `yakin ingin menghapus produk?`
          }
          buttons={[
            {
              text: "Tidak",
              role: "cancel",
              handler: () => { setShowConfirmBeforeDelete(false) }
            },
            {
              text: "Ya",
              handler: async () => {
                setShowConfirmBeforeDelete(false)
                try {
                  await deleteProduct(id);
                  setAlertMesage({ title: 'Berhasil', message: 'Produk Berhasil Dihapus!' });
                  setShowAlert(true);
                  // Reload daftar produk
                  fetchProducts();
                } catch (error) {
                  console.error("Gagal menghapus produk:", error);
                  setAlertMesage({ title: 'Gagal', message: `Gagal menghapus produk: ${error}` });
                  setShowAlert(true);
                }
              }
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;
