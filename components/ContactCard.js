import React from 'react';
import { View, StyleSheet,Text,TouchableOpacity} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const ContactCard = ({name}) => {
    return (
        <View style={styles.contactNameCard}>
            <Text style={{flex: 1, fontFamily: 'Times New Roman', fontWeight: '700', fontSize: 18}}>
                {name}
            </Text>
            <TouchableOpacity>
                <Ionicons name="ios-call" size={24} color="black" style={{marginRight: 20}}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create ({
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
})
export default ContactCard;