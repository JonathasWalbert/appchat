import React, {useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';

import ChatList from '../../Components/ChatList';

import FabButton from '../../Components/FabButton';
import ModalNewRoom from '../../Components/ModalNewRoom';

import Icon from 'react-native-vector-icons/MaterialIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {useNavigation, useIsFocused} from '@react-navigation/native';


export default function ChatRoom (){
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);

    useEffect(() => {
      const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
      setUser(hasUser);

    }, [isFocused]);

      useEffect(() => {
        let isActive = true;
        
        function getChats(){
          firestore()
          .collection('MESSAGE_THREADS')
          .orderBy('lastMessage.createdAt', 'desc')
          .limit(10)
          .get()
          .then((snapshot) => {
            const threads = snapshot.docs.map( documentSnapshot => {
              return{
                _id: documentSnapshot.id,
                name: '',
                lastMessage: {text: ''},
                ...documentSnapshot.data()
              }
            })

            if(isActive){
              setThreads(threads);
              setLoading(false);
            }
            

          })
        }
        
        getChats();

        return () => {
          isActive = false;
        }

      },[isFocused, updateScreen])

  function handleSignOut(){
    auth().signOut()
    .then(() => {
      setUser(null);
      navigation.navigate('SignIn')
    })
    .catch(() =>{
      console.log("Não possui user")
    })
  }

  function deleteRoom(ownerId, idRoom){

    if(ownerId !== user?.uid) return;

    Alert.alert("Atenção !",
    'Você tem certeza que deseja deleta essa sala?',
    [ 
      { text: 'Cancel',
      onPress: () => {},
      style:'cancel'
      },
      {
        text: 'Ok',
        onPress: () => handleDeleteRoom(idRoom)
      }
    ]
    )


  }


  async function handleDeleteRoom(idRoom){
    await firestore().collection('MESSAGE_THREADS')
    .doc(idRoom)
    .delete()
    .then(() => setUpdateScreen(!updateScreen));
  }


if(loading){
  return(
    <ActivityIndicator size='large' color="#555"
    style={{justifyContent:'center', alignItems: 'center', flex: 1}}
    />
  )
}

  return(
    <SafeAreaView style={styles.container} >
      <View style={styles.headerRoom}>

        <View style={styles.headerRoomLeft}>

          {user && (
            <TouchableOpacity onPress={handleSignOut} >
            <Icon name='arrow-back' size={28} color='#FFF' />
          </TouchableOpacity>
          ) }

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name='search' size={28} color='#FFF' />
        </TouchableOpacity>

      </View>

            <FlatList
            data={threads}
            keyExtractor={ item => item._id }
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <ChatList data={item} deleteRoom={ () => deleteRoom( item.owner, item._id) } userStatus={user} />
            )}
            />

      
      <FabButton setModalVisible={() => setVisible(true)} userStatus={user} />

      <Modal visible={visible} animationType='fade' transparent={true}  >
        <ModalNewRoom 
        setUpdateScreen={() => setUpdateScreen(!setUpdateScreen)}
        setModalVisible={() => setVisible(false)}  />
      </Modal>


      
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#FFF'
  },
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2E54D4",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    color: "#FFF",
    paddingLeft: 10
  }
})