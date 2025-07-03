// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'user', 'admin', 'superadmin'
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // Untuk menandakan proses autentikasi awal

    const navigate = useNavigate();

    const isLoggingInRef = useRef(false); // Flag untuk menandakan proses login sedang berlangsung

    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {

    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const appId = firebaseConfig.projectId;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (isLoggingInRef.current) {
                setLoadingAuth(false);
                return;
            }

            if (user) {
                setUserId(user.uid);
                let roleFound = null;
                let nameFound = null;

                const superadminDocRef = doc(db, `artifacts/${appId}/public/data/superadmins`, user.uid);
                const superadminDocSnap = await getDoc(superadminDocRef);
                if (superadminDocSnap.exists()) {
                    roleFound = superadminDocSnap.data().role;
                    nameFound = superadminDocSnap.data().name;
                }

                if (!roleFound) {
                    const partnerDocRef = doc(db, `artifacts/${appId}/public/data/partners`, user.uid);
                    const partnerDocSnap = await getDoc(partnerDocRef);
                    if (partnerDocSnap.exists()) {
                        roleFound = partnerDocSnap.data().role;
                        nameFound = partnerDocSnap.data().name;
                    }
                }

                if (!roleFound) {
                    const userDocRef = doc(db, `artifacts/${appId}/public/data/users`, user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        roleFound = userDocSnap.data().role;
                        nameFound = userDocSnap.data().name;
                    }
                }

                if (!roleFound) {
                    roleFound = 'anonymous';
                    nameFound = 'Anonymous User';
                }

                setIsLoggedIn(true);
                setUserRole(roleFound);
                setUsername(nameFound);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
                setUsername(null);
                setUserId(null);
            }
            setLoadingAuth(false);
        });

        const signInUser = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Error signing in:", error);
                alert("Authentication failed. Please try again.");
                setLoadingAuth(false);
            }
        };

        signInUser();

        return () => unsubscribe();
    }, [auth, db, appId]);

    const login = async (email, password, attemptedRole) => {
        isLoggingInRef.current = true; // Set flag: proses login sedang berlangsung
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let actualRole = null;
            let actualName = null;

            const superadminDocRef = doc(db, `artifacts/${appId}/public/data/superadmins`, user.uid);
            const superadminDocSnap = await getDoc(superadminDocRef);
            if (superadminDocSnap.exists()) {
                actualRole = superadminDocSnap.data().role;
                actualName = superadminDocSnap.data().name;
            }

            if (!actualRole) {
                const partnerDocRef = doc(db, `artifacts/${appId}/public/data/partners`, user.uid);
                const partnerDocSnap = await getDoc(partnerDocRef);
                if (partnerDocSnap.exists()) {
                    actualRole = partnerDocSnap.data().role;
                    actualName = partnerDocSnap.data().name;
                }
            }

            if (!actualRole) {
                const userDocRef = doc(db, `artifacts/${appId}/public/data/users`, user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    actualRole = userDocSnap.data().role;
                    actualName = userDocSnap.data().name;
                }
            }

            if (!actualRole) {
                await auth.signOut();
                alert('Login gagal: Peran pengguna tidak ditemukan atau tidak valid.');
                setIsLoggedIn(false); setUserRole(null); setUsername(null); setUserId(null);
                return;
            }

            if (attemptedRole === 'user' && actualRole !== 'user') {
                await auth.signOut();
                alert(`Login gagal: Akun ini adalah ${actualRole}, silakan login melalui portal yang sesuai.`);
                setIsLoggedIn(false); setUserRole(null); setUsername(null); setUserId(null);
                navigate('/login/user');
                return;
            }
            if (attemptedRole === 'admin' && actualRole === 'superadmin') {
                await auth.signOut();
                alert('Login gagal: Akun ini adalah Superadmin, silakan login melalui portal Superadmin.');
                setIsLoggedIn(false); setUserRole(null); setUsername(null); setUserId(null);
                navigate('/login/admin');
                return;
            }
            if (attemptedRole === 'admin' && actualRole === 'user') {
                await auth.signOut();
                alert('Login gagal: Akun ini adalah User, silakan login melalui portal User.');
                setIsLoggedIn(false); setUserRole(null); setUsername(null); setUserId(null);
                navigate('/login/admin');
                return;
            }
            if (attemptedRole === 'superadmin' && actualRole !== 'superadmin') {
                await auth.signOut();
                alert(`Login gagal: Akun ini adalah ${actualRole}, silakan login melalui portal yang sesuai.`);
                setIsLoggedIn(false); setUserRole(null); setUsername(null); setUserId(null);
                navigate('/superadmin-portal/login');
                return;
            }

            setIsLoggedIn(true);
            setUserRole(actualRole);
            setUsername(actualName);
            setUserId(user.uid);

            alert(`Login sebagai ${actualRole} (${actualName}) berhasil!`);
            if (actualRole === 'admin' || actualRole === 'superadmin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(`Login gagal: ${error.message}. Pastikan email dan password benar.`);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert('Email atau kata sandi salah. Jika belum punya akun, silakan daftar.');
            }
            setIsLoggedIn(false);
            setUserRole(null);
            setUsername(null);
            setUserId(null);
        } finally {
            isLoggingInRef.current = false; // Reset flag setelah proses login selesai
        }
    };

    const register = async (email, password, name, role) => {
        isLoggingInRef.current = true; // Set flag: proses register sedang berlangsung
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let collectionPath = '';
            if (role === 'user') {
                collectionPath = `artifacts/${appId}/public/data/users`;
            } else if (role === 'admin') {
                collectionPath = `artifacts/${appId}/public/data/partners`;
            }

            await setDoc(doc(db, collectionPath, user.uid), {
                name: name,
                email: email,
                role: role,
                createdAt: new Date(),
            });

            alert(`Registrasi sebagai ${role} (${name}) berhasil!`);
            // >>>>>> PERBAIKAN NAVIGASI DI SINI <<<<<<
            // Setelah registrasi berhasil, langsung panggil fungsi login untuk mengautentikasi user
            // dan mengarahkan mereka ke halaman yang sesuai.
            await login(email, password, role); // Panggil fungsi login yang akan menangani navigasi
        } catch (error) {
            console.error("Register error:", error);
            alert(`Registrasi gagal: ${error.message}.`);
        } finally {
            isLoggingInRef.current = false; // Reset flag setelah proses register selesai
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setIsLoggedIn(false);
            setUserRole(null);
            setUsername(null);
            setUserId(null);
            alert('Anda telah logout.');
            navigate('/login/user');
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    const manageUsers = async (targetRole) => {
        if (userRole !== 'superadmin') {
            alert('Akses ditolak. Hanya Superadmin yang bisa mengelola pengguna.');
            return [];
        }
        const collectionRef = collection(db, `artifacts/${appId}/public/data/${targetRole === 'user' ? 'users' : 'partners'}`);
        const q = query(collectionRef);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const addUser = async (data, targetRole) => {
        if (userRole !== 'superadmin') {
            alert('Akses ditolak. Hanya Superadmin yang bisa menambah pengguna.');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            const collectionPath = `artifacts/${appId}/public/data/${targetRole === 'user' ? 'users' : 'partners'}`;
            await setDoc(doc(db, collectionPath, user.uid), {
                name: data.name,
                email: data.email,
                role: targetRole,
                createdAt: new Date(),
                ...(targetRole === 'admin' && { venueName: data.venueName })
            });
            alert(`${targetRole} berhasil ditambahkan!`);
        } catch (error) {
            console.error("Add user error:", error);
            alert(`Gagal menambah ${targetRole}: ${error.message}`);
            throw error;
        }
    };

    const updateUser = async (id, data, targetRole) => {
        if (userRole !== 'superadmin') {
            alert('Akses ditolak. Hanya Superadmin yang bisa mengedit pengguna.');
            return;
        }
        const collectionPath = `artifacts/${appId}/public/data/${targetRole === 'user' ? 'users' : 'partners'}`;
        await setDoc(doc(db, collectionPath, id), { ...data, updatedAt: new Date() }, { merge: true });
        alert(`${targetRole} berhasil diperbarui!`);
    };

    const deleteUser = async (id, targetRole) => {
        if (userRole !== 'superadmin') {
            alert('Akses ditolak. Hanya Superadmin yang bisa menghapus pengguna.');
            return;
        }
        const collectionPath = `artifacts/${appId}/public/data/${targetRole === 'user' ? 'users' : 'partners'}`;
        await deleteDoc(doc(db, collectionPath, id));
        alert(`${targetRole} berhasil dihapus!`);
    };


    const authContextValue = {
        isLoggedIn,
        userRole,
        username,
        userId,
        isSuperadmin: userRole === 'superadmin',
        loadingAuth,
        login,
        register,
        logout,
        manageUsers,
        addUser,
        updateUser,
        deleteUser,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};