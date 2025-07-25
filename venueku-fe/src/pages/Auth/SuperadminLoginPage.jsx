import React from 'react';
import AuthFormContainer from '../../components/AuthFormContainer';
import LoginForm from '../../pages/Auth/LoginForm';

function SuperadminLoginPage() {
  return (
    <AuthFormContainer>
      <LoginForm attemptedRole="superadmin" /> {/* Teruskan role 'superadmin' */}
    </AuthFormContainer>
  );
}

export default SuperadminLoginPage;