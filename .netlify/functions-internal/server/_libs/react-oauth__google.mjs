import { r as reactExports, R as React2 } from "./react.mjs";
function useLoadGsiScript(options = {}) {
  const { nonce, locale, onScriptLoadSuccess, onScriptLoadError } = options;
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = reactExports.useState(false);
  const onScriptLoadSuccessRef = reactExports.useRef(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;
  const onScriptLoadErrorRef = reactExports.useRef(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;
  reactExports.useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    if (locale)
      scriptTag.src += `?hl=${locale}`;
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;
    scriptTag.onload = () => {
      var _a;
      setScriptLoadedSuccessfully(true);
      (_a = onScriptLoadSuccessRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadSuccessRef);
    };
    scriptTag.onerror = () => {
      var _a;
      setScriptLoadedSuccessfully(false);
      (_a = onScriptLoadErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadErrorRef);
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [nonce]);
  return scriptLoadedSuccessfully;
}
const GoogleOAuthContext = reactExports.createContext(null);
function GoogleOAuthProvider({ clientId, nonce, locale, onScriptLoadSuccess, onScriptLoadError, children }) {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError,
    locale
  });
  const contextValue = reactExports.useMemo(() => ({
    locale,
    clientId,
    scriptLoadedSuccessfully
  }), [clientId, scriptLoadedSuccessfully]);
  return React2.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
  const context = reactExports.useContext(GoogleOAuthContext);
  if (!context) {
    throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
  }
  return context;
}
function useGoogleLogin({ flow = "implicit", scope = "", onSuccess, onError, onNonOAuthError, overrideScope, state, ...props }) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = reactExports.useRef();
  const onSuccessRef = reactExports.useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = reactExports.useRef(onError);
  onErrorRef.current = onError;
  const onNonOAuthErrorRef = reactExports.useRef(onNonOAuthError);
  onNonOAuthErrorRef.current = onNonOAuthError;
  reactExports.useEffect(() => {
    var _a, _b;
    if (!scriptLoadedSuccessfully)
      return;
    const clientMethod = flow === "implicit" ? "initTokenClient" : "initCodeClient";
    const client = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2[clientMethod]({
      client_id: clientId,
      scope: overrideScope ? scope : `openid profile email ${scope}`,
      callback: (response) => {
        var _a2, _b2;
        if (response.error)
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef, response);
        (_b2 = onSuccessRef.current) === null || _b2 === void 0 ? void 0 : _b2.call(onSuccessRef, response);
      },
      error_callback: (nonOAuthError) => {
        var _a2;
        (_a2 = onNonOAuthErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onNonOAuthErrorRef, nonOAuthError);
      },
      state,
      ...props
    });
    clientRef.current = client;
  }, [clientId, scriptLoadedSuccessfully, flow, scope, state]);
  const loginImplicitFlow = reactExports.useCallback((overrideConfig) => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestAccessToken(overrideConfig);
  }, []);
  const loginAuthCodeFlow = reactExports.useCallback(() => {
    var _a;
    return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestCode();
  }, []);
  return flow === "implicit" ? loginImplicitFlow : loginAuthCodeFlow;
}
export {
  GoogleOAuthProvider as G,
  useGoogleLogin as u
};
