import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavBar from "./navBar";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Settings = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize: 34, fontWeight: '900', fontFamily: 'Times New Roman' }}>
                    Settings
                </Text>
            </View>
            <View style={styles.body}>
                <View  style={{
                    marginTop: 13,
                    borderTopColor: '#dddddf',
                    borderTopWidth: 1,
                    }}>
                    <TouchableOpacity 
                    style={styles.options}
                    onPress={ async () => {
                        await signOut(auth)
                        .then(() => {
                            props.navigation.navigate("Auth");
                        })
                        .catch ((err) => {
                            console.log("\n\n\n\nSigning out Error:\t", err, "\n\n\n\n");
                        })
                    }}
                    >
                        <Text style={styles.textOptions}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.NavbarPage}>
                <NavBar {...props} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    options: {
        
        borderBottomColor: "#dddddf",
        borderBottomWidth: 1,
        padding: 20
    },
    textOptions: {
        fontSize: 18,
        fontFamily: 'Times New Roman',
        fontWeight: '500'
    },
    NavbarPage: {
        flex: 0.85,
        backgroundColor: '#f3f3f4',
        borderWidth: 0.2,
        borderStyle: 'solid',
        borderColor: 'grey',
        shadowOpacity: 0.2,
      },
})

export default Settings;