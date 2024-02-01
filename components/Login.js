import React, { useContext, useState } from "react";
import { StyleSheet,View,SafeAreaView,Text,Alert,TextInput,TouchableOpacity} from "react-native";
import {app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../firebase/index"
import AppContext from "./AppContext";
import { Feather } from '@expo/vector-icons';

const Login = (props) => {

    const [text, onChangeText] = useState("sharjeelhbokhari@gmail.com");
    const [text2, onChangeText2] = useState("123456");
    const [showPass, setShowPass] = useState(true)
    const {setUser} = useContext(AppContext);
    
    return(
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.heading}>
          LOGIN/SIGN-UP
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Email"
          value={text}
        />
        <View style={styles.passView}>
          <TextInput
            style={styles.passInput}
            onChangeText={onChangeText2}
            value={text2}
            placeholder="Password"
            keyboardType='visible-password'
            secureTextEntry={showPass}
          />
          <TouchableOpacity>
            <Feather name={showPass ? "eye-off": "eye"} size={24} color="black" onPress={() => {setShowPass(!showPass)}} />
          </TouchableOpacity>
        </View>
        <View style={styles.fixToText}>
          <TouchableOpacity
            style={styles.loginScreenButton}
            title="Register"
            onPress={ async () =>
              await createUserWithEmailAndPassword(auth, text, text2)
                .then((userCredential) => {
                  // Registration Successful
                  console.log("\n\n\n\n\n\nLogin now");
                  const user = userCredential.user;
                  const payload = {
                    email: user.email,
                  }
                  setUser(payload);
                  Alert.alert("Registration Successful");
                  props.navigation.navigate("Home");
                })
                .catch((error) => {
                  console.log("\n\n\n\n\n\nError now", error.message);
                  if (error.code == "auth/email-already-in-use"){
                    Alert.alert("This Email Already Exists")
                  }
                  if (error.code == "auth/invalid-email") {
                    Alert.alert("Please Enter a Valid Email");
                  }
                })
            }
          >
            <Text style={styles.title}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginScreenButton}
            onPress={() => {
                signInWithEmailAndPassword(auth, text, text2)
                .then((userCredential) => {
                  const user = userCredential.user;
                  const payload = {
                    email: user.email,
                  }
                  setUser(payload);
                  // console.log(user);
                  props.navigation.navigate("Home");
                })
                .catch((error) => {
                  if (error.code ==  "auth/invalid-login-credentials") {
                    Alert.alert("Invalid Credentials!");
                  }
                });
              
            }}
          >
            <Text style={styles.title}>Login</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "white",
    },
    title: {
      textAlign: "center",
      color: "gray",
      fontSize: 20,
    },
    fixToText: {
      flexDirection: "column",
      justifyContent: "space-around",
    },
    passView: {
      flexDirection: 'row',
      width: '95%',
      marginHorizontal: 12,
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    passInput: {
      width: '90%',
      height: 50,
      fontSize: 20,
      fontWeight: '500'
    },
    input: {
      height: 50,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      fontSize: 20,
      borderRadius: 8,
      fontWeight: '500'
    },
    loginScreenButton: {
      height: 50,
      width: "94%",
      marginRight: 12,
      marginLeft: 12,
      marginTop: 10,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: "#000",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#fff",
    },
    heading: {
      fontWeight: "bold",
      fontSize: 35,
      color: "gray",
      textAlign: "center",
      marginBottom: 40,
      fontFamily: "Times New Roman",
    },
  });
export {Login};