import React, {
  ReactNode, createContext, useContext, useEffect, useState
} from "react";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authClient: AuthClient | undefined;
  identity: Identity | null;
  principal: Principal | null;
};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  authClient: undefined,
  identity: null,
  principal: null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider: "https://identity.ic0.app/#authorize",
  },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [identity, setIdentity] = useState<null | Identity>(null);
  const [principal, setPrincipal] = useState<null | Principal>(null);

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    if (authClient) {
      authClient.login({
        ...options.loginOptions,
        onSuccess: () => {
          updateClient(authClient);
        },
      });
    }
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    setAuthClient(client);
  }

  async function logout() {
    if (authClient) {
      await authClient.logout();
      await updateClient(authClient);
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
  }
};

/**
 * @type {React.FC}
 */
export function AuthProvider({ children }: {
  children: ReactNode;
}) {
  const auth = useAuthClient();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);