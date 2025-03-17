import { useCallback, useEffect, useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonAlert,
  IonText,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  useIonViewWillEnter,
  RefresherEventDetail,
} from '@ionic/react';
import { pencil, trash, add, exitOutline, chevronDownCircleOutline } from "ionicons/icons"
import './StudentList.css'
import { getAllData, deleteData, Student } from '../hooks/restAPIRequest'
import AlertInfo, { AlertState } from '../components/AlertInfo'
import { useHistory, useLocation } from 'react-router-dom'
import { useAuth } from "../hooks/useAuthCookie";

interface DontRefresh {
  dontRefresh: boolean;
}

const StudentList: React.FC = () => {
  // setup Alert
  const [alert, setAlert] = useState<AlertState>({
    showAlert: false,
    header: '',
    alertMesage: '',
    hideButton: false,
  });

  const { token, role, logout } = useAuth();
  const history = useHistory();
  const location = useLocation<DontRefresh>();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLogoutAlert, setLogoutShowAlert] = useState(false);

  const [isRefresh, setIsRefresh] = useState(true);
  const [isRole, setIsRole] = useState<string | null>(null);

  const [showAlert, setShowAlert] = useState(false);

  const [refreshList, setRefreshList] = useState(false);


  useEffect(() => {
    setIsRole(role);
    if (token === null && role === null) {
      history.replace("/login", { isTokenExpired: true });
    }
  }, [token, role, history]);

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(async () => {
      await getAllData(setStudents)
      event.detail.complete();
    }, 0)

  }

  const fetchStudents = useCallback(async () => {
    setRefreshList(false);
    setLoading(true)

    const getData: any = await getAllData(setStudents);

    if (getData !== undefined) {
      setAlert({
        showAlert: true,
        header: `Kasalahan Server!`,
        alertMesage: getData
      });
      setRefreshList(true)
    }

    setLoading(false)

  }, [])

  useIonViewWillEnter(() => {
    setIsRefresh(false);
    fetchStudents()
  }, [])

  useEffect(() => {
    if (isRefresh) {
      setIsRefresh(false)
    }
  }, [isRefresh])

  const handleDelete = async () => {
    if (selectedId) {
      setShowAlert(false)
      setAlert({
        showAlert: true,
        header: "Sedang menghapus",
        alertMesage: "Tunggu Sebentar...",
        hideButton: true,
      });

      try {

        const result = await deleteData(selectedId)

        console.log(result)

        if (result.success) {
          setAlert({
            showAlert: true,
            header: "Berhasil",
            alertMesage: "Data Telah Terhapus."
          });

          fetchStudents();

        } else {
          setAlert({
            showAlert: true,
            header: "Gagal!",
            alertMesage: result.error
          });
          setRefreshList(true)
        }

      } catch (error: any) {
        setAlert({
          showAlert: true,
          header: "Kasalahan Server!",
          alertMesage: error.error
        });
      }

    }
    setSelectedId(null);
  }

  const handleLogout = () => {
    logout();
  }

  let content;
  if (!token || loading) {
    content = (
      <>
        <IonProgressBar type="indeterminate"></IonProgressBar>
        <IonText color="secondary">
          <h2>Memuat Data... </h2>
        </IonText>
      </>
    )
  } else {
    content = (
      <IonList>
        {students.map((student: Student) => (
          <IonItem key={student.id}>
            <IonLabel>
              <h2>{student.name}</h2>
              <p>{student.address} - {(student.gender === 'L') ? 'Pria' : 'Wanita'}</p>
            </IonLabel>
            {isRole === 'admin' ? (
              <>
                <IonButton color="primary" onClick={() => history.push('/student-edit', { student })} >
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton color="danger" onClick={() => { setSelectedId(student.id); setShowAlert(true) }}>
                  <IonIcon icon={trash} />
                </IonButton>
              </>
            ) : ('')}
          </IonItem>
        ))}
      </IonList>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Daftar Siswa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Daftar Siswa</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" pullFactor={0.5} pullMin={100} pullMax={200} onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing..."
          ></IonRefresherContent>
        </IonRefresher>

        {content}

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => history.push('/student-add')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" color="danger">
          <IonFabButton onClick={() => setLogoutShowAlert(true)}>
            <IonIcon icon={exitOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* IonAlert untuk konfirmasi sebelum menghapus */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Konfirmasi"
        message="Yakin ingin menghapus data siswa ini?"
        buttons={[
          {
            text: "Batal",
            role: "cancel",
            handler: () => setSelectedId(null),
          },
          {
            text: "Hapus",
            handler: handleDelete,
          },
        ]}
      />

      {/* IonAlert untuk konfirmasi Logout */}
      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setLogoutShowAlert(false)}
        header="Konfirmasi"
        message="Yakin ingin Logout akun?"
        buttons={[
          {
            text: "Batal",
            role: "cancel",
            handler: () => setSelectedId(null),
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
  );
};

export default StudentList;
