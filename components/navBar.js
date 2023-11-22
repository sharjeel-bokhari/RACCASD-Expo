import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";


const NavBar = (props) => {
    return (
        <View style={navStyle.container}>
            <View>    
                <TouchableOpacity  style={navStyle.btnContainer} onPress={() => props.navigation.navigate('Favourites')}>
                    <View style={navStyle.btnIcon}>
                        <Image
                                style={{ width: 20, height: 20, tintColor: 'black'}} 
                                source={require('../images/star.png')} />
                    </View>
                    <Text style={navStyle.btnContent}> Favourites </Text>
                </TouchableOpacity>
            </View>
            <View> 
                <TouchableOpacity  style={navStyle.btnContainer} onPress={() => props.navigation.navigate('Recents')}>
                    <View style={navStyle.btnIcon}>
                        <Image
                                style={{ width: 20, height: 20, tintColor: 'black'}} 
                                source={require('../images/recents.png')} />
                    </View>
                    <Text style={navStyle.btnContent}> Recents </Text>
                </TouchableOpacity>
            </View>
            <View >  
                <TouchableOpacity style={navStyle.btnContainer} onPress={() => props.navigation.navigate('Contacts')}>
                    <View style={navStyle.btnIcon}>
                        <Image
                                style={{ width: 20, height: 20, tintColor: 'black'}} 
                                source={require('../images/contacts.png')} />
                    </View>  
                    <Text style={navStyle.btnContent}> Contacts </Text>
                </TouchableOpacity>
            </View>
            <View>  
                <TouchableOpacity  style={navStyle.btnContainer} onPress={() => props.navigation.navigate('Settings')}>
                    <View style={navStyle.btnIcon}>
                        <Image
                                style={{ width: 25, height: 20, tintColor: 'black'}} 
                                source={require('../images/settings.png')} />
                    </View>  
                    <Text style={navStyle.btnContent}> Settings </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const navStyle = StyleSheet.create({
   container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
        
   },
   btnContent: {
        fontFamily: "Times New Roman",
   },
   btnIcon: {
        alignItems:'center',
    },
});

export default NavBar;
