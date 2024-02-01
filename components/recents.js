import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import NavBar from "./navBar";

const Recents = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize: 34, fontWeight: '900', fontFamily: 'Times New Roman' }}>
                    Recents
                </Text>
            </View>
            <View style={styles.body}>
                
                <ScrollView style={{
                    marginTop: 13,
                    borderTopColor: '#dddddf',
                    borderTopWidth: 1,
                    }}>
                    
                    <TouchableOpacity style={styles.contactNames}>
                        <Text>
                            Hassan
                        </Text>
                    </TouchableOpacity>                    
                    
                </ScrollView>
            </View>
            <View style={styles.NavbarPage}>
                <NavBar {...props} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },
    header: {
        flex: 1.3,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 10,
        
    },
    body: {
        flex: 7,
    }, 
    contactNames: {
        
        borderBottomColor: "#dddddf",
        borderBottomWidth: 1,
        padding: 20
    },
    NavbarPage: {
        flex: 0.85,
        backgroundColor: '#f3f3f4',
        borderWidth: 0.2,
        borderStyle: 'solid',
        borderColor: 'grey',
        shadowOpacity: 0.2,
      },

});
export default Recents;