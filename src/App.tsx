import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router'
import { images, square, triangle, person } from 'ionicons/icons'
import StudentList from './pages/StudentList'
import Tab2 from './pages/Tab2'
import Tab3 from './pages/Tab3'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'
import StudentAdd from './pages/StudentAdd';
import StudentEdit from './pages/StudentEdit';

import { StudentProvider } from './context/StudentContext'
import LoginForm from './pages/LoginForm';

setupIonicReact();

const App: React.FC = () => (
  <StudentProvider>
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path={`/login`}>
              <LoginForm />
            </Route>
            <Route exact path={`/student-list`}>
              <StudentList />
            </Route>
            <Route exact path={`/student-add`}>
              <StudentAdd />
            </Route>
            <Route exact path={`/student-edit`}>
              <StudentEdit />
            </Route>
            <Route exact path={`/tab2`}>
              <Tab2 />
            </Route>
            <Route exact path={`/`}>
              <LoginForm />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="student-list" href={`/student-list`}>
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>Siswa</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href={`/tab2`}>
              <IonIcon aria-hidden="true" icon={images} />
              <IonLabel>Gallerys</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href={`/login`}>
              <IonIcon aria-hidden="true" icon={square} />
              <IonLabel>Login</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </StudentProvider>
);

export default App;
