import { useContext } from "react";
import { signOut } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { auth } from "../../utils/firebase";
import { AuthContext } from "../../utils/AuthContext";
import styles from "./SideBar.module.css";

import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setLogin, userInfo, setUserInfo } = useContext(AuthContext);

  // Sign out the user and clear the stored session data.
  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("isLogin");
      localStorage.removeItem("userInfo");

      setLogin(false);
      setUserInfo(null);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarIcon}>
        <ArticleIcon sx={{ fontSize: 54, marginBottom: 2 }} />
        <div className={styles.sideBarTopContent}>Resume Screening</div>
      </div>

      <div className={styles.sideBarOptionBlock}>
        <Link
          to="/dashboard"
          className={[
            styles.sideBarOption,
            location.pathname === "/dashboard"
              ? styles.selectedOption
              : null,
          ].join(" ")}
        >
          <DashboardIcon sx={{ fontSize: 22 }} />
          <div>Dashboard</div>
        </Link>

        <Link
          to="/history"
          className={[
            styles.sideBarOption,
            location.pathname === "/history"
              ? styles.selectedOption
              : null,
          ].join(" ")}
        >
          <ManageSearchIcon sx={{ fontSize: 22 }} />
          <div>History</div>
        </Link>

        {/* Show the Admin link only to admin users. */}
        {userInfo?.role === "admin" && (
          <Link
            to="/admin"
            className={[
              styles.sideBarOption,
              location.pathname === "/admin"
                ? styles.selectedOption
                : null,
            ].join(" ")}
          >
            <SupervisorAccountIcon sx={{ fontSize: 22 }} />
            <div>Admin</div>
          </Link>
        )}

        <div onClick={handleLogout} className={styles.sideBarOption}>
          <LogoutIcon sx={{ fontSize: 22 }} />
          <div>LogOut</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;