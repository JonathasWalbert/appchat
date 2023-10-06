import React from 'react';
import {
  TouchableOpacity, 
  Text, 
  StyleSheet, 
} from 'react-native';

import {useNavigation} from '@react-navigation/native'

export default function FabButton( { setModalVisible, userStatus } ){
  const navigation = useNavigation();

  function handleNavigateButton(){
    userStatus ? setModalVisible() : navigation.navigate('SignIn');
  }


  return(
    <TouchableOpacity  
    activeOpacity={0.9}
    style={styles.containerButton} 
    onPress={handleNavigateButton}
    >
      <Text style={styles.text}> + </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerButton:{
    backgroundColor: '#2e54d4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '5%',
    right: '6%'
  },
  text:{
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold'
  }
})