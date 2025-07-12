import { useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { logUsage } from "../services/analyticsService";

const useUsageLogger = () => {
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.userObj);

  useEffect(() => {
    if (!user) return;
    const deviceType = /Mobi/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    logUsage({ module: location.pathname, deviceType }).catch(() => {});
  }, [location.pathname, user]);
};

export default useUsageLogger;
