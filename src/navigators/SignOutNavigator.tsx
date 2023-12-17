import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
//import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
export default () =>
{ 
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />      */}
        </Stack.Navigator>
    )
}