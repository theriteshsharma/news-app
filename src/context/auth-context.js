import { createContext } from "react";
const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {},
  user: {},
  setUser: () => {},

  category: [],
  setCategory: () => {},
  interest: [],
  setInterests: () => {},
  blocked: [],
  setBlocked: () => {},
});

export default AuthContext;
