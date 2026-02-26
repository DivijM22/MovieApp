import { createRoot } from 'react-dom/client';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import DashboardContent from './components/DashboardContent.jsx';
import NotFound from './components/NotFound.jsx';
import CardDetails from './components/CardDetails.jsx';
import SearchResultsPage from './components/SearchResultsPage.jsx';
import UserPage from './components/UserPage.jsx';

const router=createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        index : true,
        element : <Login/>
      },
      {
        path : 'dashboard',
        element : <Dashboard/>,
        children : [
          {
            index : true,
            element : <DashboardContent/>
          },
          {
            path : 'details',
            element : <CardDetails/>
          },
          {
            path : 'search_results',
            element : <SearchResultsPage/>
          },
          {
            path : 'user_page',
            element : <UserPage/>
          }
        ]
      }
    ]
  },
  {
    path : '*',
    element : <NotFound/>
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
);