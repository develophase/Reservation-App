import React, { useState, useEffect } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import SplashScreen from 'react-native-splash-screen'

import SplashScreen from '../screens/SplashScreen';
import SignInNavigator from './SignInNavigator';
import SignOutNavigator from './SignOutNavigator';

export default () =>
{
    
    // const [initializing, setInitializing] = useState(true)

    // const getAccount = async (offset: number, limit: number, phoneNumber: number) => {
    //     try {
    //       let options = {
    //         method: 'GET',
    //         headers: {
    //           'xc-token': apikey
    //         }
    //       };

    //       let query = `(Phone,eq,${phoneNumber})`;
      
    //       let response = await fetch(getAccountsByParams(offset, limit, query), options);
    //       let json = await response.json();
    //       return json.list;

    //     } catch (error) {
    //       console.error(
    //         ' Something went wrong in getNowPlayingMoviesList Function',
    //         error,
    //       );
    //     }
    // };

    // const getUserLogin = async () => {
    //     const userLogin = await EncryptedStorage.getItem('login_user');
    //     return userLogin;
    // };

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const session = await getUserLogin();
    //             if (session !== null && session !== undefined) {
    //                 const userLogin = JSON.parse(session);
    //                 const userAccount = await getAccount(0, 1, userLogin.Phone);
    //                 if(userAccount.length > 0) {
    //                     setIsLoggedIn(true);
    //                 }
    //             }

    //             setInitializing(false);
    //             //SplashScreen.hide()
    //         }
    //         catch (error) {
    //             console.error('Something went wrong while getting Data', error);
    //         }
    //     })();
    // }, []);

    // if (initializing) {
    //     return null
    // }

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{animation: 'default'}}
            />
            <Stack.Screen
                name="SignInNavigator"
                component={SignInNavigator}
                options={{animation: 'default'}}
            />
            <Stack.Screen
                name="SignOutNavigator"
                component={SignOutNavigator}
                options={{animation: 'default'}}
            />            
        </Stack.Navigator>
    )
}
