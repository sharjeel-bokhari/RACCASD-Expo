import React, { useContext } from "react";
import { StyleSheet,View,SafeAreaView,Text,Alert,TextInput,TouchableOpacity} from "react-native";
import {app, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../firebase/index"
import AppContext from "./AppContext";

const Login = (props) => {
    const auth = getAuth(app);
    const [text, onChangeText] = React.useState("sharjeelhbokhari@gmail.com");
    const [text2, onChangeText2] = React.useState("123456");

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
        <TextInput
          style={styles.input}
          onChangeText={onChangeText2}
          value={text2}
          placeholder="Pin"
          keyboardType="numeric"
        />
        <View style={styles.fixToText}>
          <TouchableOpacity
            style={styles.loginScreenButton}
            title="Register"
            onPress={() =>
              createUserWithEmailAndPassword(auth, text, text2)
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
                  const errorMessage = error.message;
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

    input: {
      height: 50,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      fontSize: 20,
      borderRadius: 8,

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