import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Parts } from './pages/Parts';
import { PartFormPage } from './pages/PartFormPage';
import { Sales } from './pages/Sales';
import { Users } from './pages/Users';
import { UserFormPage } from './pages/UserFormPage';
import { GeneralInfoPage } from './pages/GeneralInfoPage';
import { PCTypesPage } from './pages/PCTypesPage';
import { Donors } from './pages/Donors';
import { DonorFormPage } from './pages/DonorFormPage';
import { SaleFormPage } from './pages/SaleFormPage';
import { InventoryFormPage } from './pages/InventoryFormPage';
import { InventoryDetailsPage } from './pages/InventoryDetailsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

              {/* Inventory Routes */}
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/new" element={<InventoryFormPage />} />
              <Route path="inventory/:id" element={<InventoryDetailsPage />} />
              <Route path="inventory/:id/edit" element={<InventoryFormPage />} />

              <Route path="parts" element={<Parts />} />
              <Route path="parts/new" element={<PartFormPage />} />
              <Route path="parts/:id/edit" element={<PartFormPage />} />

              <Route path="donors" element={<Donors />} />
              <Route path="donors/new" element={<DonorFormPage />} />
              <Route path="donors/:id/edit" element={<DonorFormPage />} />

              <Route path="sales" element={<Sales />} />
              <Route path="sales/new" element={<SaleFormPage />} />

              <Route path="users" element={<Users />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:id" element={<UserFormPage />} />

              <Route path="settings" element={<GeneralInfoPage />} />
              <Route path="/types" element={<PCTypesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
