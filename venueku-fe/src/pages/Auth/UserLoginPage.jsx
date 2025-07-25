// VENUEKU-FE/src/pages/Auth/UserLoginPage.jsx
import React from 'react';
import AuthFormContainer from '../../components/AuthFormContainer';
import LoginForm from '../../pages/Auth/LoginForm'; // Pastikan path benar

function UserLoginPage() {
  return (
    <AuthFormContainer>
      <LoginForm attemptedRole="user" />
    </AuthFormContainer>
  );
}

export default UserLoginPage;