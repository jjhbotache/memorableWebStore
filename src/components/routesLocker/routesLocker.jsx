import { useNavigate } from "react-router-dom";
import { getRedirectUrl } from "../../functions/functions";
import { useEffect } from "react";

export default function RoutesLocker({permissionsNeeded}) {
  const navigate = useNavigate();
  const redirectUrl = getRedirectUrl(permissionsNeeded)

  useEffect(() => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } 
  }, []);

  return null;
};
