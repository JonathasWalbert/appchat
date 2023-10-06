import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from '../Pages/SignIn';
import ChatRoom from '../Pages/ChatRoom';
import Messages from '../Pages/Messages';
import Search from '../Pages/Search';

const AppStack = createNativeStackNavigator();

export default function AppRoutes(){
  return(

    <AppStack.Navigator initialRouteName='ChatRoom' >
      
        <AppStack.Screen name='SignIn' component={SignIn}
        options={{
          title:'Faça o Login'
        }}
        />

        <AppStack.Screen name='ChatRoom' component={ChatRoom}
              options={{
                headerShown:false
              }}
        />

        <AppStack.Screen name='Messages' component={Messages}
              options={ ({ route }) => ({
                title: route.params?.thread.name
              })}
        />

        <AppStack.Screen name='Search' component={Search}
              options={{
                title:'Procurando algum grupo ?'
              }}
        />



    </AppStack.Navigator>
  )
}