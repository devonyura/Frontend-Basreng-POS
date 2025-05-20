import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonSpinner, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { createProduct, ProductPayload, UpdateProductPayload, updateProduct, Product } from '../../hooks/restAPIProducts';
import { getCategories, Category } from '../../hooks/restAPICategories';
import { getSubCategoriesbyCategory } from '../../hooks/restAPISubCategories';


interface ProductFormProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  onSuccess?: () => void; // callback setelah simpan berhasil
  initialProduct?: any; // callback setelah simpan berhasil
}

export interface AlertMessageProps {
  title: string;
  message: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onDidDismiss, onSuccess, initialProduct }) => {
  const [formData, setFormData] = useState<ProductPayload>({
    category_id: '',
    subcategory_id: null,
    name: '',
    price: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMesage, setAlertMesage] = useState<AlertMessageProps>({ title: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Handle fetch subkategori jika kategori berubah
  useEffect(() => {
    if (formData.category_id) {
      getSubCategoriesbyCategory(formData.category_id)
        .then((data) => setSubcategories(data))
        .catch((error) => {
          console.error('Gagal Mengambil Sub Kategori', error);
          setSubcategories([]);
        });
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  // Fetch kategori setiap buka modal
  useEffect(() => {
    if (isOpen) {
      resetForm();
      getCategories()
        .then((data) => setCategories(data))
        .catch((error) => console.error(error));
    }
  }, [isOpen]);

  // Set nilai default jika sedang edit
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        category_id: initialProduct.category_id,
        subcategory_id: initialProduct.subcategory_id,
        name: initialProduct.name,
        price: initialProduct.price,
      });
    } else {
      resetForm()
    }
  }, [initialProduct]);

  const resetForm = () => {
    setFormData({
      category_id: '',
      subcategory_id: null,
      name: '',
      price: ''
    });
  };

  const handleChange = (field: keyof ProductPayload, value: string | null) => {
    if (field === 'category_id') {
      setFormData((prev) => ({
        ...prev,
        category_id: value ?? '',
        subcategory_id: '', // reset subcategory agar fieldnya muncul kembali
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.category_id || !formData.name || !formData.price) {
      setShowAlert(true);
      setAlertMesage({ title: 'Validasi Error', message: 'Semua field (kecuali subkategori) harus diisi!' });
      return;
    }

    try {
      setLoading(true);

      if (initialProduct) {
        const updatePayload: UpdateProductPayload = {
          id: initialProduct.id,
          ...formData,
        };
        await updateProduct(updatePayload);

      } else {
        await createProduct(formData);

      }
      resetForm();
      onDidDismiss();
      onSuccess?.();
    } catch (err) {
      setShowAlert(true);
      setAlertMesage({ title: 'Gagal Menyimpan', message: `${err}` });
      console.error('Gagal menyimpan produk:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDidDismiss}>Kembali</IonButton>
          </IonButtons>
          <IonTitle>{initialProduct ? 'Edit Produk' : 'Tambah Produk'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nama Produk</IonLabel>
          <IonInput
            value={formData.name}
            onIonChange={(e) => handleChange('name', e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Harga</IonLabel>
          <IonInput
            type="number"
            value={formData.price}
            onIonChange={(e) => handleChange('price', e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Kategori</IonLabel>
          <IonSelect
            value={formData.category_id}
            onIonChange={(e) => handleChange('category_id', e.detail.value)}
            placeholder="Pilih Kategori"
            aria-required
          >
            {categories.map((cat) => (
              <IonSelectOption key={cat.id} value={cat.id}>
                {cat.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {subcategories && subcategories.length > 0 && (
          <IonItem>
            <IonLabel position="stacked">Sub Kategori</IonLabel>
            <IonSelect
              value={formData.subcategory_id || ''}
              onIonChange={(e) => handleChange('subcategory_id', e.detail.value)}
              placeholder="Pilih Sub Kategori"
            >
              {subcategories.map((Scat) => (
                <IonSelectOption key={Scat.id} value={Scat.id}>
                  {Scat.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : initialProduct ? 'Simpan Perubahan' : 'Simpan Barang Baru'}
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertMesage.title}
          message={alertMesage.message}
          buttons={[{ text: 'OK', role: 'cancel' }]}
        />
      </IonContent>
    </IonModal>
  );
};

export default ProductForm;
