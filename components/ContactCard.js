import React, { useContext, useEffect, useState} from 'react';
import { View, StyleSheet,Text,TouchableOpacity,TextInput, Modal, SafeAreaView, Alert} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AppContext from './AppContext';
import { db, collection, getDocs, deleteDoc, doc, getDoc,setDoc} from "../firebase/index";
import BouncyCheckbox from "react-native-bouncy-checkbox";


const ContactCard = ({name}) => {
    const [isCallingScreenVisible, setIsCallingScreenVisible] = useState(false);
    const [receiverEmail, setReceiverEmail] = useState([]);
    const [isMutePressed, setIsMutePressed] = useState(false);
    const [isUpdateScreenVisible, setIsUpdateScreenVisible] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactInfo, setContactInfo] = useState({});
    
    const {user, loadAgain, setLoadAgain} = useContext(AppContext);

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
          setFirstName('');
          setLastName('');
          setEmail('');
          setIsFav(false);
          console.log('Contact added with Name: ', contactDocRef.id);
        } catch (e) {
          console.error('Error adding contact: ', e);
        }
    };

    const getCaller = async (userEmail) => {
        try {
            const querySnapshot = await getDocs(collection(db, "users", userEmail, "contacts"));
            if (!querySnapshot.empty) {
                const receiverEmails = querySnapshot.docs.map((doc)=> {
                    const receiverData = doc.data();
                    // console.log("\nName:\t",name);
                    if(receiverData.Name == name){
                        console.log('\u001b[35m', receiverData.Email);
                        // add a query in add contacts to avoid storing repeateding names.
                        return {
                            email: receiverData.Email,
                        };
                    };
                });
                setReceiverEmail(receiverEmails.filter(Boolean));
                console.log('\u001b[34m Caller Email',receiverEmail);
                console.log('\u001b[32m Caller Name',receiverEmail);

            } else {
                
            }
        } catch (e) {
            console.log('\u001b[31m Error fetching user Email', e);
        }
    }
    const getContactInfo = async (userEmail) => {
        // It is used to get the contact info from the database
        // to help us update the contact information
        try {
            const querySnapshot = await getDocs(collection(db, "users", userEmail, "contacts"));
            if (!querySnapshot.empty) {
                const contactInformation = querySnapshot.docs.map((doc)=> {
                    const contactData = doc.data();
                    // console.log("\nName:\t",name);
                    if(contactData.Name == name){
                        console.log('\u001b[35m', contactData);
                        setContactInfo(contactData);
                        // add a query in add contacts to avoid storing repeateding names.
                        return {
                            name: contactData.Name,
                            email: contactData.Email,
                            fav: contactData.Favourites
                        };
                    };
                });
                setContactInfo(contactInformation.filter(Boolean)[0]);
                console.log('\u001b[34m Contact Information',contactInformation[0]);
                console.log('\u001b[34m Contact Information Variable',contactInfo.name);

            } else {
                
            }
        } catch (e) {
            console.log('\u001b[31m Error fetching user Email', e);
        }
    }

    const deleteContact = async (userEmail) => {
        try {
            const contactDoc = doc(db, "users", userEmail, "contacts", name);
            await deleteDoc(contactDoc);
            console.log("Contact ", name," Deleted!");
            setLoadAgain(!loadAgain);
            console.log("Contact Deleted!", name + " has been deleted successfully!");
            // Alert.alert("Contact Deleted!", name + " has been deleted successfully!");
        } catch (err) {
            console.log("Error Deleting Contact:\t", err);
        }
    }

    const updateContact = async () => {
        try{
            deleteContact(user.email);
            addContacts(user.email,firstName, lastName, email, isFav);
        } catch (err) {
            console.log("\u001b[34m \nError Updating Contact:\t", err)
        }
    }

    useEffect(() => {
        // This hook will run when this component is rendered.
        // This Hook will also re-render on the changes based on any changes made in the project.
        // console.log(contactInfo.Name.split(' '))
        console.log(
            "Names: ", name,
            "First Names: ", firstName,
            "Last Name: ", lastName)
        getContactInfo(user.email);
    }, [])
    return (
        <TouchableOpacity 
            style={styles.contactNameCard}
            onPress={() => {
                setFirstName(name.split(' ')[0]);
                setLastName(name.split(' ')[1]);
                setEmail(contactInfo.email);
                setIsFav(contactInfo.fav);
                console.log(
                    "First Name: ", firstName,
                    "Last Name: ", lastName
                )
                // setLoadAgain(!loadAgain)
                setIsUpdateScreenVisible(true);

            }}
        >
            <Text style={{flex: 1, fontFamily: 'Times New Roman', fontWeight: '700', fontSize: 18}}>
                {name}
            </Text>
            <TouchableOpacity
                onPress={() =>{
                    setIsCallingScreenVisible(true);
                    getCaller(user.email);
                    setIsMutePressed(false);
                }}
            >
                <Ionicons name="ios-call" size={24} color="black" style={{marginRight: 20}}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    deleteContact(user.email);
                }}
            >
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
            {/* This Modal is used to display the calling screen */}
            <Modal 
                visible={isCallingScreenVisible}
                animationType='fade'
                presentationStyle="fullScreen"
                >
                    <SafeAreaView style={styles.modal}>
                        <View style={styles.callerId}>
                            <Text style={{fontSize: 35, fontWeight: '600', fontFamily: 'Times New Roman', alignSelf:'center'}}>
                                {name}
                            </Text>
                            <Text style={{color: 'grey',fontSize: 20, marginVertical: 10, fontWeight: '100', fontFamily: 'Times New Roman', alignSelf:'center'}}>
                                Call Time
                            </Text>
                        </View>
                        <View style={styles.modalBody}>                        
                            <TouchableOpacity style={styles.muteID} 
                                onPress={() => {
                                    setIsMutePressed(!isMutePressed);
                                }}
                            >
                                {isMutePressed ?
                                <FontAwesome name="microphone" size={30} color="black" /> 
                                :
                                <FontAwesome name="microphone-slash" size={30} color="black" /> 
                                }
                                
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                            style={styles.endCallButton}
                            onPress={()=> {
                                setIsCallingScreenVisible(false);
                            }}
                            >
                                <MaterialIcons name="call-end" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    

            </Modal>
            {/* This Modal is used to Update the contact */}
            <Modal 
                    visible={isUpdateScreenVisible}
                    animationType='slide'
                    presentationStyle="pageSheet"
                >
                    <View style={styles.modalUpdateScreen}>
                        <SafeAreaView style={styles.modalUpdateScreenHeader}>
                            <SafeAreaView style={{ flex: 0.5}}>
                                <TouchableOpacity 
                                style={{
                                    marginTop: 25,
                                    marginLeft: 15,
                                }}
                                onPress={()=> setIsUpdateScreenVisible(false)}>
                                    <Text style={{color: 'blue', fontSize: 16}}>
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
                                    // update the contact
                                    updateContact();
                                    setIsUpdateScreenVisible(false);
                                    // setLoadAgain(!loadAgain);
                                }}
                                >
                                    <Text
                                    style={{color: 'blue', fontSize: 16}}>
                                        Update
                                    </Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </SafeAreaView>
                        <SafeAreaView style={styles.modalUpdateScreenBody}>
                            <Text style={{marginLeft: 10, fontSize: 16, fontWeight: 'bold',fontFamily: 'Times New Roman'}}> First name</Text>
                            <TextInput 
                                style={styles.inputModalUpdateScreen}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
                                
                            />
                            <Text style={{marginLeft: 10, fontSize: 16,fontWeight: 'bold', fontFamily: 'Times New Roman'}}> Last name</Text>
                            <TextInput 
                                style={styles.inputModalUpdateScreen}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
                                
                            />
                            <Text style={{marginLeft: 10, fontSize: 16, fontWeight: 'bold', fontFamily: 'Times New Roman'}}> Email</Text>
                            <TextInput 
                                style={styles.inputModalUpdateScreen}
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
                                   isChecked={isFav}
                                   value={isFav}
                                >
                                </BouncyCheckbox>
                            </View>
                        </SafeAreaView>
                        
                    </View>
                    
                </Modal>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create ({
    contactNameCard:{
        marginVertical: 5,
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#dddddf',
        width: '95%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    modalUpdateScreen: {
        flex: 1
    },
    modalUpdateScreenBody:{
        flex: 9,
        justifyContent: 'flex-start',
        // marginBottom: 20
    },
    inputModalUpdateScreen:{
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 20,
        borderRadius: 8,
        fontFamily: 'Times New Roman',
        fontSize: 15,
    },
    modalUpdateScreenHeader: {
        flex: 1,
        flexDirection: 'row',
    },

    modal: {
        flex: 1,
        flexDirection: "column"
    },
    modalBody: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
    callerId:{
        flex: 1,
    },
    muteID: {
        padding: 20,
        paddingHorizontal: 30,
        backgroundColor: '#dddddf',
        borderRadius: 60
    },
    endCallButton: {
        padding: 20,
        paddingHorizontal: 30,
        backgroundColor: '#dddddf',
        borderRadius: 60
        // flex:1,
        // backgroundColor: 'red',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
})
export default ContactCard;