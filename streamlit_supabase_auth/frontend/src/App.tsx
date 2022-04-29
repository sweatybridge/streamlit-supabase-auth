import React, { useEffect, useState } from "react";
import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection,
} from "streamlit-component-lib";
import { Button } from "@supabase/ui";
import { Auth } from "./Auth";
import {
  AuthChangeEvent,
  Provider,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";

const getLocationHash = () => {
  try {
    // Parse url fragment from parent window
    return window.parent.location.hash;
  } catch (e) {
    // Dev environment is hosted at different domain / port
    // Streamlit escapes url inside an iframe, decode first
    const decoded = decodeURIComponent(window.location.href);
    return new URL(decoded).hash;
  }
};

const getSessionFromUrl = async (supabase: SupabaseClient) => {
  try {
    const hash = getLocationHash().substring(1);
    const params = new URLSearchParams(hash);
    const error_description = params.get("error_description");
    if (error_description) throw new Error(error_description);

    const access_token = params.get("access_token");
    if (!access_token) return;
    const expires_in = params.get("expires_in");
    if (!expires_in) throw new Error("No expires_in detected.");
    const refresh_token = params.get("refresh_token");
    if (!refresh_token) throw new Error("No refresh_token detected.");
    const token_type = params.get("token_type");
    if (!token_type) throw new Error("No token_type detected.");
    const provider_token = params.get("provider_token");

    const timeNow = Math.round(Date.now() / 1000);
    const expires_at = timeNow + parseInt(expires_in);

    const { user, error } = await supabase.auth.api.getUser(access_token);
    if (error) throw error;

    const session: Session = {
      provider_token,
      access_token,
      expires_in: parseInt(expires_in),
      expires_at,
      refresh_token,
      token_type,
      user: user!,
    };
    supabase.auth["_saveSession"](session);
    const recoveryMode = params.get("type");
    supabase.auth["_notifyAllSubscribers"]("SIGNED_IN");
    if (recoveryMode === "recovery") {
      supabase.auth["_notifyAllSubscribers"]("PASSWORD_RECOVERY");
    }
    // Sandboxed iframe cannot update parent URL
    // window.parent.location.hash = "";
  } catch (e) {
    console.error("Error getting session from URL.", e);
  }
};

const createClient = (supabaseUrl: string, supabaseKey: string) => {
  // console.info("Creating Supabase client");
  const client = new SupabaseClient(supabaseUrl, supabaseKey, {
    detectSessionInUrl: false,
  });
  Streamlit.setComponentValue(client.auth.session());
  Streamlit.setComponentReady();
  // Parsing valid session from url will trigger a SIGNED_IN event
  getSessionFromUrl(client);
  return client;
};

const handleAuthEvent = (event: AuthChangeEvent, session: Session | null) => {
  switch (event) {
    case "SIGNED_IN":
    case "SIGNED_OUT":
      // Duplicate logout events happens under multitab
      // console.info(event, session);
      Streamlit.setComponentValue(session);
      Streamlit.setComponentReady();
      break;
    default:
  }
};

const Container = (props: {
  type: "login" | "logout";
  supabase: SupabaseClient;
  providers: Provider[];
}) => {
  const { type, supabase, providers } = props;

  // Update iframe height when user context changes
  useEffect(() => Streamlit.setFrameHeight());

  const { user } = Auth.useUser();
  if (type === "login" && !user) {
    return (
      <Auth
        providers={providers}
        supabaseClient={supabase}
        onError={() => Streamlit.setFrameHeight()}
      />
    );
  }

  if (type === "logout" && user) {
    return (
      <Button block onClick={() => supabase.auth.signOut()}>
        Sign out
      </Button>
    );
  }

  return null;
};

const App = (props: ComponentProps) => {
  const { url, apiKey, providers, key } = props.args;

  // Initialise supabase client once
  const [supabase, setSupabase] = useState<SupabaseClient>(() =>
    createClient(url, apiKey)
  );

  // Subscribe to auth events for each new client
  useEffect(() => {
    // console.info("Adding auth change listener");
    const { data } = supabase.auth.onAuthStateChange(handleAuthEvent);
    if (data) {
      return () => data.unsubscribe();
    }
  }, [supabase]);

  // Recreate supabase client only when url or apiKey changes
  useEffect(() => {
    if (supabase["supabaseUrl"] !== url || supabase["supabaseKey"] !== apiKey) {
      const client = createClient(url, apiKey);
      setSupabase(client);
    }
  }, [supabase, url, apiKey]);

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container type={key} supabase={supabase} providers={providers} />
    </Auth.UserContextProvider>
  );
};

export default withStreamlitConnection(App);
