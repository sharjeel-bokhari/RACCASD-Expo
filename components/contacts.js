import {React, useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, TouchableOpacity, Image, Modal, SafeAreaView, FlatList } from "react-native";
import NavBar from "./navBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { db, collection, addDoc, doc, setDoc, getDoc, getDocs} from "../firebase/index";
import ContactCard from './ContactCard';
import AppContext from "./AppContext";

const ContactsPage = (props) => {
    const [isAddContactVisible, setIsAddContactVisible] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactCard, setContactCard] = useState("");

    const {user,loadAgain,setLoadAgain} = useContext(AppContext);
    const addContacts = async (userEmail, firstName, lastName, email, isFav) => {
        try {
          const userDocRef = doc(db, 'users', userEmail);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
            });
          }
          const contactsCollectionRef = collection(userDocRef, 'contacts');
          const contactDocRef = doc(contactsCollectionRef,`${firstName} ${lastName}`);
          await setDoc(contactDocRef,{
            Name: `${firstName} ${lastName}`,
            Email: email, 
            Favourites: isFav,
          })
          setLoadAgain(
            !loadAgain
          )
          console.log('Contact added with Name: ', contactDocRef.id);
          setEmail("");
          setFirstName("")
          setLastName("");
          setIsFav(false);
          
        } catch (e) {
          console.error('Error adding contact: ', e);
        }
        getContacts(user.email);
    };

    const getContacts = async (userEmail) => {
        try 
        {
            const querySnapshot = await getDocs(collection(db, "users", userEmail, "contacts"));
            if(!querySnapshot.empty){
                const contacts = querySnapshot.docs.map((doc) => {
                    const contactData = doc.data();
                    return {
                    name: contactData.Name,
                    email: contactData.Email,
                    favorites: contactData.Favourites,
                    };
                });
                setContactCard(contacts);
            } else {
                console.log("\n\nNo Contactss\n\n")
            }
            
        }
        catch (e) {
            console.log("Error finding contacts:",e);
        }
    }
        

    useEffect(() => {
        getContacts(user.email);
    },[]);
    // useEffect(() => {
    //     console.log("\n\n\n\nContactCard:\n\n",contactCard,"\n\n\n\n")
    //   }, [contactCard])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize: 34, fontWeight: '900', fontFamily: 'Times New Roman' }}>
                    Contacts
                </Text>
                <TouchableOpacity 
                style={[styles.header, styles.plusIcon]}
                onPress={()=> {setIsAddContactVisible(true)}}
                >
                    <Image 
                    style={{width: 25, height: 25, tintColor: 'blue'}}
                    source={require('../images/plus.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Modal 
                visible={isAddContactVisible}
                animationType='slide'
                presentationStyle="pageSheet"
                >
                    <View style={styles.modal}>
                        <SafeAreaView style={styles.modalHeader}>
                            <SafeAreaView style={{ flex: 0.5}}>
                                <TouchableOpacity 
                                style={{
                                    marginTop: 25,
                                    marginLeft: 15,
                                }}
                                onPress={()=> setIsAddContactVisible(false)}>
                                    <Text style={{color: 'blue'}}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                            <SafeAreaView style={{flex: 0.5, alignItems: 'flex-end', marginRight: 10}}>

                                <TouchableOpacity 
                                style={{
                                    marginTop: 25,
                                }}
                                onPress={()=>{
                                    setIsAddContactVisible(false)
                                    // Add The contact to his phonebook
                                    addContacts(user.email,firstName,lastName,email,isFav);
                                }}
                                >
                                    <Text
                                    style={{color: 'blue'}}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </SafeAreaView>
                        <SafeAreaView style={styles.modalBody}>
                        <Text style={{marginLeft: 10, fontSize: 16, fontWeight: 'bold',fontFamily: 'Times New Roman'}}> First name</Text>
                            <TextInput 
                                style={styles.inputModal}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
                                
                            />
                            <Text style={{marginLeft: 10, fontSize: 16,fontWeight: 'bold', fontFamily: 'Times New Roman'}}> Last name</Text>
                            <TextInput 
                                style={styles.inputModal}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
                                
                            />
                            <Text style={{marginLeft: 10, fontSize: 16, fontWeight: 'bold', fontFamily: 'Times New Roman'}}> Email</Text>
                            <TextInput 
                                style={styles.inputModal}
                                textContentType="emailAddress"
                                placeholder="example@gmail.com"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            <View style={{flex: 0.08, flexDirection: 'row',marginLeft: 14, alignSelf: 'flex-start'}}>
                                
                                <BouncyCheckbox 
                                    size={25}
                                    // iconStyle={{ borderColor: "blue" }}
                                    fillColor="red"
                                    bounceEffectIn={2}
                                    onPress={() => {setIsFav(!isFav)}}
                                    text="Add To Favourites"
                                    textStyle={{
                                        textDecorationLine: "none",
                                        fontSize: 22,
                                        fontFamily: 'Times New Roman',
                                        fontWeight: '700',
                                        color: 'red'
                                   }}
                                   value={isFav}
                                >
                                </BouncyCheckbox>
                            </View>
                        </SafeAreaView>
                        
                    </View>
                    
                </Modal>
                <View style={{ padding: 10 }}>
                    <TextInput 
                        placeholder="Search"
                        style={styles.searchBar}
                        placeholderTextColor= 'gray'
                    />
                    
                </View>
                {/* <ScrollView style={styles.contactNames}>
                    <ContactCard name={contactCard.name}/>
                    
                </ScrollView> */}
                {
                    contactCard.length > 0 ?
                    <FlatList 
                        data={contactCard}
                        style={styles.contactNames}
                        renderItem={({item}) => 
                            <ContactCard name={item.name} />
                        }
                        keyExtractor={(item, index)=> index.toString()}
                    /> : 
                    <Text style={{flex: 1,alignSelf: 'center', width: '90%', justifyContent: 'center'}}>
                        No Contacts. Press the Plus Icon on top right side of the screen to add a Contact.
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
    modalHeader: {
        flex: 1,
        flexDirection: 'row',
    },
    header: {
        flex: 1.3,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 10,
    },
    plusIcon: {
        justifyContent: 'flex-end',
        paddingRight: 9,
        marginBottom: 8,
    },
    modal: {
        flex: 1
    },
    modalBody:{
        flex: 9,
        justifyContent: 'flex-start',
        // marginBottom: 20
    },
    inputModal:{
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 20,
        borderRadius: 8,
        fontFamily: 'Times New Roman',
        fontSize: 15,
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
    contactNameCard:{
        // marginLeft: 10,
        marginVertical: 5,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#dddddf',
        width: '95%',
        borderRadius: 10,
        alignSelf: 'center',
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

export default ContactsPage;