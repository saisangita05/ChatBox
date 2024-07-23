import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Ensure you have the correct import here
import { createContext, useState, useEffect } from "react";
import "core-js/stable/atob";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [authUser, setAuthUser] = useState(
    AsyncStorage.getItem("authToken") || null
  );

  console.log("BABE AU", authUser);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const userId = decodedToken.userId;
          setUserId(userId);
          setToken(storedToken);
          console.log("Token and User ID set:", { storedToken, userId });
        } else {
          console.log("No stored token found");
        }
      } catch (error) {
        console.log("Error fetching token or decoding it:", error);
      }
    };

    fetchUser();
  }, [token, userId]);

  return (
    <AuthContext.Provider
      value={{ token, userId, setToken, setUserId, authUser, setAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
