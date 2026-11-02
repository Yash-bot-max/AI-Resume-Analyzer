import { createElement, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.js";

const WithAuthHOC = (WrappedComponent) => {
  // This component handles authentication for protected pages.
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const { isLogin, authLoading } = useContext(AuthContext);

    // Redirect unauthenticated users after checking the auth state.
    useEffect(() => {
      if (!authLoading && !isLogin) {
        navigate("/", { replace: true });
      }
    }, [authLoading, isLogin, navigate]);

    if (authLoading) {
      return <div>Loading...</div>;
    }

    if (!isLogin) {
      return null;
    }

    return createElement(WrappedComponent, props);
  };

  return AuthenticatedComponent;
};

export default WithAuthHOC;