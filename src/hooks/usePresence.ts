import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "visitor_session_id";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const usePresence = (page: string) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();

    const updatePresence = async () => {
      try {
        const { error } = await supabase
          .from("presence")
          .upsert(
            {
              session_id: sessionId,
              page: page,
              last_seen: new Date().toISOString(),
            },
            { onConflict: "session_id" }
          );

        if (error) {
          console.error("Error updating presence:", error);
        }
      } catch (err) {
        console.error("Presence error:", err);
      }
    };

    // Update immediately
    updatePresence();

    // Update every 30 seconds
    intervalRef.current = setInterval(updatePresence, 30000);

    // Cleanup on unmount or page change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [page]);
};

export const usePresenceCleanup = () => {
  useEffect(() => {
    const cleanup = async () => {
      // Delete entries older than 1 minute (inactive visitors)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      await supabase
        .from("presence")
        .delete()
        .lt("last_seen", oneMinuteAgo);
    };

    // Run cleanup every minute
    const interval = setInterval(cleanup, 60000);
    cleanup();

    return () => clearInterval(interval);
  }, []);
};
