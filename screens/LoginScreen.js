import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Input } from "react-native-elements"

import { auth } from "../firebase/config"

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
                navigation.replace('Chat');
            } else {
                // No user is signed in.
            }
        });
        return unsubscribe;
    }, [])


    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                let errorMessage = error.message;
                alert(errorMessage)
            });
    }

    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
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
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title="sign in" style={styles.button} onPress={signIn} />
            <Button title="register" style={styles.button} onPress={() => navigation.navigate("Register")} />
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

export default LoginScreen