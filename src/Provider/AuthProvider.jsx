
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({children}) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

const createUser = (email, password) =>{
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
}

const signIn = (email, password) =>{
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
}

const logOut =  () =>{
    setLoading(true);
    return signOut(auth);
}


useEffect(() =>{
const unSubscribe = onAuthStateChanged(auth, currentUser =>{
    console.log('user in the auth state changed', currentUser);
    
    if (currentUser)
    {
        axios.post('https://assignment-11-seven-beta.vercel.app/jwt', {email:currentUser.email}, { withCredentials: true })
        .then(res => {
            console.log(res.data);
            setUser(currentUser);
            setLoading(false);
        })
    }
    else{
       axios.get('https://assignment-11-seven-beta.vercel.app/logout', { withCredentials: true })
       .then(() => {
        setUser(null);
        setLoading(false);
       })
    }
});
return () =>{
    unSubscribe();
}
}, [])


    const authInfo = {
        user,
        loading,
      createUser,
      signIn,
      logOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;