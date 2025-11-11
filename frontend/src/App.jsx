import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import LayoutLanding from './components/Layout/LayoutLanding';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsList from './pages/ProjectsList';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Profile from './pages/Profile';
import UsersList from './pages/UsersList';
import PublicProfile from './pages/PublicProfile';
import MyProjects from './pages/MyProjects';
import MatchesPage from './pages/MatchesPage';
import NotificationsPage from './pages/NotificationsPage';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  console.log('🎨 App component renderizando...');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page com layout próprio */}
          <Route path="/" element={
            <LayoutLanding>
              <LandingPage />
            </LayoutLanding>
          } />
          
          {/* Páginas de autenticação com layout próprio */}
          <Route path="/login" element={
            <LayoutLanding>
              <Login />
            </LayoutLanding>
          } />
          <Route path="/register" element={
            <LayoutLanding>
              <Register />
            </LayoutLanding>
          } />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Páginas da aplicação com layout padrão */}
          <Route path="/dashboard" element={
            <Layout>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/projects" element={
            <Layout>
              <ProjectsList />
            </Layout>
          } />
          <Route path="/projects/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/projects/:projectId" element={
            <Layout>
              <ProjectDetails />
            </Layout>
          } />
          <Route path="/projects/:projectId/edit" element={
            <Layout>
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/users" element={
            <Layout>
              <UsersList />
            </Layout>
          } />
          <Route path="/users/:userId" element={
            <Layout>
              <PublicProfile />
            </Layout>
          } />
          <Route path="/my-projects" element={
            <Layout>
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/matches" element={
            <Layout>
              <ProtectedRoute>
                <MatchesPage />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/notifications" element={
            <Layout>
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            </Layout>
          } />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              zIndex: 9997,
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
