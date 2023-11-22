import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Favourites from "./favs";
import Settings from "./settings";
import Recents from "./recents";
import Splash from "../Screens/splash";
import {Login} from "./Login";
import ContactsPage from "./contacts";


const Root = createStackNavigator();
const authStack = createStackNavigator();

const Navigator = () => {
    return (
        <Root.Navigator screenOptions={{
            headerShown:false
        }
        }>
            <Root.Screen 
                name="Favourites"
                component={Favourites}
            />
            <Root.Screen 
                name="Contacts"
                component={ContactsPage}
            />
            <Root.Screen 
                name="Settings"
                component={Settings}
            />
            <Root.Screen 
                name="Recents"
                component={Recents}
            />
        </Root.Navigator>
    );

};

const Auth = () => {
    return(
        <authStack.Navigator 
        screenOptions={{
            headerShown: false
        }}>
            <authStack.Screen 
                name= "Login"
                component={Login}
            />

        </authStack.Navigator>
    );
}

const MainStack = () => {
    return(
        <authStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <authStack.Screen 
                name= "Splash"
                component={Splash}
            />
            <authStack.Screen 
                name= "Auth"
                component={Auth}
            />
            <authStack.Screen 
                name= "Home"
                component={Navigator}
            />
        </authStack.Navigator>
    );
}

export default MainStack;