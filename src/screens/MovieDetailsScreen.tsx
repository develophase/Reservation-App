import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  apikey, 
  eventDetails,
  getEventTicketBookedByUser
} from '../api/apicalls';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import EncryptedStorage from 'react-native-encrypted-storage';
import CategoryHeader from '../components/CategoryHeader';
import CastCard from '../components/CastCard';

const getEventDetails = async (movieid: number) => {
  try {
    let options = {
      method: 'GET',
      headers: {
        'xc-token': apikey
      }
    };

    let response = await fetch(eventDetails(movieid), options);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error('Something Went wrong in getMoviesDetails Function', error);
  }
};

const getTicketDetails = async (eventId: number, userId: number) => {
  try {
    let options = {
      method: 'GET',
      headers: {
        'xc-token': apikey
      }
    };

    let query = `(EventsId,eq,${eventId})~and(AccountsId,eq,${userId})`;

    let response = await fetch(getEventTicketBookedByUser(0, 1, query), options);
    let json = await response.json();

    return json.list;

  } catch (error) {
    console.error('Something went wrong while getting Data', error);
  }
};

const getDate = (date: string) => {
  const currentDate = new Date(date);
  return `${date.substring(8, 10)} ${currentDate.toLocaleString('default', { month: 'long' })} ${date.substring(0, 4)} `
};

const getTime = (date: string) => {
  const currentDate = new Date(date);
  return `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
};

const MovieDetailsScreen = ({navigation, route}: any) => {
  const [eventData, setEventData] = useState<any>(undefined);
  const userLogin = useRef<any>({});
  const [ticketData, setTicketData] = useState<any>({});
  const [ticketSeat, setTicketSeat] = useState<any>("");

  const refresh = async () => {
    await getEventDetails(route.params.movieid)
      .then(async (eventData) => {
        setEventData(eventData);
          await EncryptedStorage.getItem('login_user')
            .then (async (session) => {
              if(session !== null && session !== undefined) {
                userLogin.current = (JSON.parse(session));
                await getTicketDetails(route.params.movieid, userLogin.current.Id)
                  .then (async (ticket) => {
                    if(ticket?.length > 0) {
                      const ticketSeat = ticket.map((item : any) => item.Num).join(', ');
                      console.log(ticketSeat);
                      setTicketSeat(ticketSeat);
                    }
                    setTicketData(ticket);
                  })
              }
            });
      });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

  if (
    eventData == undefined &&
    eventData == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header={''}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </ScrollView>
    );
  }
  
  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar hidden />

      <View>
        <ImageBackground
          source={
            require('../assets/image/prayer.jpg')
          }
          style={styles.imageBG}>
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={''}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.imageBG}></View>
        <Image
          source={{ uri: eventData.PosterImg[0].signedUrl }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.timeContainer}>
        <CustomIcon name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>
            {getDate(eventData?.Date)}
            {getTime(eventData?.Date)}
        </Text>
      </View>

      <View>
        <Text style={styles.title}>{eventData?.Name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.rateContainer}>
          <CustomIcon name="seat" style={styles.seatIcon} />
          <Text style={styles.runtimeText}>
            {eventData?.TotalSeat}
          </Text>
        </View>
        <Text style={styles.descriptionText}>{eventData?.Desc}</Text>
      </View>

      <View>
        <View style={{ flexDirection:"row", justifyContent: 'center'}}>
          {ticketData?.length == 0 ? (
            <TouchableOpacity
              style={styles.buttonBG}
              onPress={() => {
                navigation.push('SeatBooking', {
                eventid: eventData.Id,
                eventdate: getDate(eventData.Date),
                eventtime: getTime(eventData.Date),
                posterimg: eventData.PosterImg[0].signedUrl,
                row: eventData.Row,
                col: eventData.Col,
                level: eventData.Level,
                code: eventData.Code
                });
              }}>
              <Text style={styles.buttonText}>Select Seat</Text>
            </TouchableOpacity>
          ) : ( 
            <TouchableOpacity
              style={styles.buttonBG}
              onPress={() => {
                navigation.push('Ticket', {
                  eventid: eventData.Id,
                  date: getDate(eventData.Date),
                  time: getTime(eventData.Date),
                  ticketimage: eventData.PosterImg[0].signedUrl,
                  index: 0,//ticketData[0].Row,
                  subindex: 0,//ticketData[0].Col,
                  num: ticketSeat,
                  //num: ticketData[0].Num,
                  //qrcode: ticketData[0].ReservationCode,
                  name: ticketData[0].AccountsName,
                  eventname: eventData.Name,
                  eventcode: eventData.Code,
                  code: ticketData[0].ReservationCode,
                });
              }}>
              <Text style={styles.buttonText}>Ticket Detail</Text>
          </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  scrollViewContainer: {
    flex: 1,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  imageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  cardImage: {
    width: '60%',
    aspectRatio: 200 / 300,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.WhiteRGBA50,
    marginRight: SPACING.space_8,
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.space_15,
  },
  runtimeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  genreContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.space_20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreBox: {
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_4,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA75,
  },
  tagline: {
    fontFamily: FONTFAMILY.poppins_thin,
    fontSize: FONTSIZE.size_14,
    fontStyle: 'italic',
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  infoContainer: {
    marginHorizontal: SPACING.space_24,
  },
  rateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  starIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Yellow,
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  descriptionText: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  buttonBG: {
    alignItems: 'center',
    marginVertical: SPACING.space_24,
    marginHorizontal: SPACING.space_10,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25 * 2,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Orange,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
});

export default MovieDetailsScreen;
