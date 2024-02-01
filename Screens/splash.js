import { React, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import {View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <SafeAreaView style={{flex:1, alignContent: 'center', justifyContent:"center"}}>
            <ActivityIndicator size={'large'} color={'#000000'} />
       </SafeAreaView>
    );
};

export default Splash;