import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { AuthContext } from "./AuthContext";

// Manage and provide authentication state to the application.
const AuthProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Listen for changes in the Firebase authentication state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          const storedUser = localStorage.getItem("userInfo");

          // Safely restore previously stored user information.
          let parsedUser = {};

          try {
            parsedUser = storedUser ? JSON.parse(storedUser) : {};
          } catch (error) {
            console.error("Unable to parse stored user data:", error);
          }

          // Preserve database details while refreshing Firebase profile information.
          const updatedUser = {
            ...parsedUser,
            name: user.displayName || parsedUser.name,
            email: user.email || parsedUser.email,
            photoUrl: user.photoURL || parsedUser.photoUrl,
          };

          setLogin(true);
          setUserInfo(updatedUser);
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        } else {
          setLogin(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Authentication State Error:", error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setLogin,
        userInfo,
        setUserInfo,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;