import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Input, Header, Text } from "react-native-elements"

import { auth } from "../firebase/config"
import Spacer from "../components/Spacer"

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
                navigation.replace('Chats');
            } else {
                //prevent back button after user logs out
                navigation.canGoBack() && navigation.popToTop()
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
        <View>
            <Header
                centerComponent={{
                    text: 'hmu', style: {
                        color: '#fff', fontSize: 60, fontFamily: "LeckerliOne_400Regular"
                    }
                }}
                containerStyle={{
                    backgroundColor: "#ffb347",

                }}

            />
            <View style={styles.container}>
                <Text h3 style={{ color: "grey", marginBottom: 20, fontWeight: "bold" }}>Login</Text>

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
                <TouchableOpacity onPress={() => navigation.navigate("Register")}><Spacer><Text style={styles.link}>Don't have an account? <Text style={{ fontWeight: "bold" }}>Sign up instead</Text></Text></Spacer></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        marginTop: "10%"
    },
    button: {
        width: 200,
        marginTop: 20
    },
    link: {
        color: "grey",
        textAlign: "center",
        marginTop: 20
    }
})

export default LoginScreen