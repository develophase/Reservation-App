import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import SeatBookingScreen from '../screens/SeatBookingScreen';
import TicketScreen from '../screens/TicketScreen';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator initialRouteName="Tab" screenOptions={{headerShown: false}}>
            <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{animation: 'default'}}
            />
            <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{animation: 'slide_from_right'}}
            />
            <Stack.Screen
            name="SeatBooking"
            component={SeatBookingScreen}
            options={{animation: 'slide_from_bottom'}}
            />
            <Stack.Screen
            name="Ticket"
            component={TicketScreen}
            options={{animation: 'slide_from_bottom'}}
            />
        </Stack.Navigator>
    );
};

