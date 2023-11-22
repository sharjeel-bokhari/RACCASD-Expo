import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import NavBar from "./navBar";
import ContactCard from "./ContactCard";
import { db, collection, getDocs} from "../firebase/index";
import AppContext from "./AppContext";

const Favourites = (props) => {
    const [isFav, setIsFav] = useState([]);
    const {user, loadAgain} = useContext(AppContext); //Get the userEmail from the Login page somehow and use it here and in contacts
    console.log("\n\n\n\n\n",user,"\n\n\n\n")
    const getFavs = async (userEmail) => {
        try {
            const querySnapshot = await getDocs(collection(db, "users", userEmail, "contacts"));
            if (!querySnapshot.empty) {
                const favs = querySnapshot.docs.map((doc) => {
                    const favData = doc.data();
                    if(favData.Favourites == true){
                        return {
                            name: favData.Name,
                            email: favData.Email,
                            favorites: favData.Favourites,
                        };
                        
                    };
                });
                setIsFav(favs.filter(Boolean));
            } else {
                console.log("\n\nNo Favouritess\n\n")
            }
        } 
        catch (e) {
            console.log("Error Occurred:\n", e);
       }
    }

    useEffect(()=>{
        getFavs(user.email);
    },[
        loadAgain
    ])

    // useEffect(() => {
    //     console.log("\n\n\n\nIsFav:\n\n",isFav,"\n\n\n\n")
    //   }, [isFav])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize: 34, fontWeight: '900', fontFamily: 'Times New Roman' }}>
                    Favourites
                </Text>
            </View>
            <View style={styles.body}>
                <View style={{ padding: 10 }}>
                    <TextInput 
                        placeholder="Search Favourites"
                        style={styles.searchBar}
                   
                        placeholderTextColor= 'gray'
                    />
                </View>
                {
                    isFav.length > 0 ?
                    <FlatList 
                        data={isFav}
                        style={styles.contactNames}
                        renderItem={({item}) => 
                            <ContactCard name={item.name} />
                        }
                        keyExtractor={(item, index)=> index.toString()}
                    /> : 
                    <Text style={{flex: 1,alignSelf: 'center', width: '90%', justifyContent: 'center'}}>
                        No Contacts. Press Add a contact from the Contacts Screen.
                    </Text>
                } 
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
    searchBar: {
        borderRadius: 8,
        backgroundColor: '#dddddf',
        height: 36,
        fontFamily: 'Times New Roman',
        padding: 5,
        fontSize: 16.4,
    },
    contactNames: {
        marginTop: 13,
        borderTopColor: '#dddddf',
        borderTopWidth: 1
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

export default Favourites;