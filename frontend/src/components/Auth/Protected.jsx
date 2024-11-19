import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";

const Protected = ({ children, roles }) => {
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);

  // if token not found It will redirect it to login
  if (!token) {
    navigate({ to: "/" });
    return;
  }

  if (token && user && roles.length > 0) {
    const isCanAccess = roles.includes(user?.roleId);
    if (!isCanAccess) {
      if (user?.roleId === 1) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
      return;
    }
  }

  return children;
};

export default Protected;
