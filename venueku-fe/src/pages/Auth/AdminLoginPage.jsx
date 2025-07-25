import React from 'react';
import AuthFormContainer from '../../components/AuthFormContainer';
import LoginForm from '../../pages/Auth/LoginForm';

function AdminLoginPage() {
  return (
    <AuthFormContainer>
      <LoginForm attemptedRole="admin" /> {/* Teruskan role 'admin' */}
    </AuthFormContainer>
  );
}

export default AdminLoginPage;