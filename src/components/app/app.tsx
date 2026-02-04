import { BrowserRouter } from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { AppContent } from './appContent';

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AppContent />
    </div>
  </BrowserRouter>
);

export default App;
