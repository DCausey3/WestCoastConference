import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Mission from './pages/about/Mission';
import History from './pages/about/History';
import Leadership from './pages/about/Leadership';
import ConstitutionBylaws from './pages/about/ConstitutionBylaws';
import Officers from './pages/Officers';
import Churches from './pages/Churches';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'about/mission', Component: Mission },
      { path: 'about/history', Component: History },
      { path: 'about/leadership', Component: Leadership },
      { path: 'about/constitution-bylaws', Component: ConstitutionBylaws },
      { path: 'officers', Component: Officers },
      { path: 'churches', Component: Churches },
      { path: 'events', Component: Events },
      { path: 'resources', Component: Resources },
      { path: 'contact', Component: Contact },
    ],
  },
]);
