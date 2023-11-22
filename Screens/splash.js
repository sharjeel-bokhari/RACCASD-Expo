import { React, useEffect } from 'react';
import {View, Text} from 'react-native';

const Splash = (props) => {
    useEffect(() => {
        
        const timer = setTimeout(() => {
            if (false) {
                props.navigation.replace("Home");
            }
            else {
                props.navigation.replace("Auth");
            }
        }, 3000);
        return () => {
            clearTimeout(timer);
        }

    }, [])
    return(
        <View>
            <Text>
                Splash
            </Text>
            
       </View>
    );
};

export default Splash;