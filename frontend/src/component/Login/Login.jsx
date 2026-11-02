import { useContext, useState } from "react";
import styles from "./Login.module.css";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { setLogin, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Authenticate the user with Google and register them in the backend.
  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      const response = await axios.post("/api/user", userData);

      setUserInfo(response.data.user);

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      setLogin(true);
      localStorage.setItem("isLogin", true);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.code === "auth/cancelled-popup-request") {
        console.log("Previous Google login popup was cancelled.");
      } else {
        alert(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.loginCard}>
        <div className={styles.loginCardTitle}>
          <h1>Login</h1>
          <VpnKeyIcon />
        </div>

        <div
          className={styles.googleBtn}
          onClick={handleLogin}
          style={{
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <GoogleIcon sx={{ fontSize: 20, color: "red" }} />
          {loading ? "Signing in..." : "Sign in with Google"}
        </div>
      </div>
    </div>
  );
};

export default Login;
