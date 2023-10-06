import React, {useState} from 'react';

import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native'


import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';



export default function SignIn(){
  const navigation = useNavigation();

  const [type, setType] = useState(false); //false = Login | true = SignUp

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');


  function handleLogin(){
    if (type){
      if(name === '' || email ==='' || password === '') return;

      auth().createUserWithEmailAndPassword(email, password)
      .then( (user) => { 
        user.user.updateProfile({
          displayName: name
        })
        .then(() => {
          navigation.goBack();
        })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
    
        alert(error);
        console.log(error);
      })

    }else{
      auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.goBack();
      }).catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Este email já está em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          alert('Email inválido!');
        }
      })
    }
  }


  return(
    <SafeAreaView style={styles.container} >
      <Text style={styles.logo} >HeyGrupos</Text>
      <Text style={{marginBottom: 20}} > Ajude, colabore, faça networking </Text>

      {type && (
         <TextInput style={styles.input} 
         value={name} 
         onChangeText={(text) => setName(text)} 
         placeholder='Qual seu nome ?'
         placeholderTextColor="#99999B"
         />
      ) }
      

    <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)}
    placeholder='Seu email'
    placeholderTextColor="#99999B"
     />

    <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)} 
    placeholder='Sua senha'
    placeholderTextColor="#99999B"
    secureTextEntry={true}
    />

    <TouchableOpacity style={[styles.buttonLogin, { backgroundColor: type ? "#F53745" : "#57DD86" } ]  }
    onPress={handleLogin}
    >

        <Text style={styles.buttonText}>
          {type ? "Cadastrar" : "Acessar"}
        </Text>

    </TouchableOpacity>
 
    <TouchableOpacity onPress={() => setType(!type)}>
        <Text> 
        {type ? "Já possuo uma conta" : "Criar uma nova conta"}
        </Text>
    </TouchableOpacity>
    
    

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor:"#fff"
  },
  logo:{
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold'

  },
  input:{
    color: "#121212",
    backgroundColor: '#EBEBEB',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin:{
    width: "90%",
    backgroundColor: "",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 6
  },
  buttonText:{
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 19
  }
})