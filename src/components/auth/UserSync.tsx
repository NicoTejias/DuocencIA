import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexAuth } from "convex/react";

export function UserSync() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    // Solo intentar sincronizar si estamos autenticados y NO hay errores previos en la URL
    const hasError = new URLSearchParams(window.location.search).has("error");
    
    if (isAuthenticated && !isLoading && !hasError) {
      storeUser()
        .then(() => {})
        .catch((err) => {
          console.error("User sync error:", err.message);
          if (err.message.includes("institucionales") || err.message.includes("permiten")) {
            window.location.replace("/auth-error?error=" + encodeURIComponent(err.message));
          }
        });
    }
  }, [isAuthenticated, isLoading, storeUser]);

  return null;
}
