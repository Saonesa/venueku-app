// VENUEKU-FE/src/pages/Auth/UserRegisterPage.jsx
import React from 'react';
import AuthFormContainer from '../../components/AuthFormContainer';
import RegisterForm from '../../pages/Auth/RegisterForm'; // Pastikan path benar

function UserRegisterPage() {
  return (
    <AuthFormContainer>
      <RegisterForm attemptedRole="user" />
    </AuthFormContainer>
  );
}

export default UserRegisterPage;