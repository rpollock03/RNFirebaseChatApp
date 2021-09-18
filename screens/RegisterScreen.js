import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Input } from "react-native-elements"

import { auth, db } from "../firebase/config"


const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const register = () => {

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                //SIGNED IN
                //creates new user, but basically just email and password data, no displayname etc is stored. So we update the user object
                let user = userCredential.user
                user.updateProfile({
                    displayName: name,
                    email: email,
                    photoURL: imageUrl ? imageUrl : "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
                })
                    .catch(function (error) {
                        alert(error.message)
                    })
                //this part adds user to the users collection on firebase
                db.collection("users").doc(auth.currentUser.uid).set({
                    displayName: name,
                    email,
                    photoUrl: imageUrl ? imageUrl : "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
                })
                    .catch(function (error) {
                        alert(error.message)
                    })
                navigation.popToTop()
            })
            .catch((error) => {
                alert(error.message)
            });
    }



    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your name'
                label='Name'
                leftIcon={{ type: 'material', name: 'badge' }}
                value={name}
                onChangeText={text => setName(text)}
            />
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password} onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Input
                placeholder='Enter your image url'
                label='Profile Picture'
                leftIcon={{ type: 'material', name: 'face' }}
                onChangeText={text => setImageUrl(text)}
            />
            <Button
                title="register" style={styles.button}
                onPress={register}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    button: {
        width: 200,
        marginTop: 10
    }
})
export default RegisterScreen