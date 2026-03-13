import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexAuth } from "convex/react";

export function UserSync() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      storeUser().catch(console.error);
    }
  }, [isAuthenticated, isLoading, storeUser]);

  return null;
}
