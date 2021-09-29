import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Button, Input, Header, Text } from "react-native-elements"

import { auth, db, storage } from "../firebase/config"
import Spacer from "../components/Spacer"

require("firebase/firestore")
require("firebase/firebase-storage")
import * as ImagePicker from "expo-image-picker"



const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null) // store image taken
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

    const register = () => {
        if (profileImage) {
            uploadImage()
        } else {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    //SIGNED IN
                    //creates new user, but basically just email and password data, no displayname etc is stored. So we update the user object
                    let user = userCredential.user
                    user.updateProfile({
                        displayName: name,
                        email: email,
                        photoURL: "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
                    })
                        .catch(function (error) {
                            alert(error.message)
                        })
                    //this part adds user to the users collection on firebase
                    db.collection("users").doc(auth.currentUser.uid).set({
                        displayName: name,
                        email,
                        photoUrl: "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
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
    }

    {/* image picker setup*/ }
    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    // choose image from gallery and assign to state 
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, //can change to All or Videos
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    {/* upload image to firestore and update user profile info*/ }
    const uploadImage = async () => {
        const response = await fetch(profileImage)
        const blob = await response.blob()
        const childPath = `profileImages/${Math.random().toString(36)}`
        console.log(childPath)
        const task = storage
            .ref()
            .child(childPath)
            .put(blob)

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((downloadUrl) => {

                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        //SIGNED IN
                        //creates new user, but basically just email and password data, no displayname etc is stored. So we update the user object
                        let user = userCredential.user
                        user.updateProfile({
                            displayName: name,
                            email: email,
                            photoURL: downloadUrl
                        })
                            .catch(function (error) {
                                alert(error.message)
                            })
                        //this part adds user to the users collection on firebase
                        db.collection("users").doc(auth.currentUser.uid).set({
                            displayName: name,
                            email,
                            photoUrl: downloadUrl
                        })
                            .catch(function (error) {
                                alert(error.message)
                            })
                        setProfileImage(null)
                        navigation.popToTop()
                    })
                    .catch((error) => {
                        alert(error.message)
                    });
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }


    {/* prevent crashing if no gallery permission */ }
    if (hasGalleryPermission === null || hasGalleryPermission === false) {
        return <View />;
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
                <Text h3 style={{ color: "grey", marginBottom: 20, fontWeight: "bold" }}>Sign up</Text>
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

                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {profileImage && <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, marginRight: 20 }} />}
                    <Button title="Pick an image" onPress={pickImage} />

                </View>



                <Button
                    title="register" style={styles.button}
                    onPress={register}
                />
                <TouchableOpacity onPress={() => navigation.navigate("Login")}><Spacer><Text style={styles.link}>Already have an account? <Text style={{ fontWeight: "bold" }}>Sign in instead</Text></Text></Spacer></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10

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
export default RegisterScreen