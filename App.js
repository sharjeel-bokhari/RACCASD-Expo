import Navigator from "./components/navigator";
import { NavigationContainer } from "@react-navigation/native";
import AppContext from "./components/AppContext";
import { useState } from "react";


export default function App() {
  const [user, setUser] = useState({});
  const [loadAgain, setLoadAgain] = useState(false);

  return (
    <NavigationContainer>
      <AppContext.Provider
        value={{
          user,
          setUser,
          loadAgain,
          setLoadAgain,
        }}
      >
        <Navigator />
      </AppContext.Provider>
    </NavigationContainer>
  );
}
