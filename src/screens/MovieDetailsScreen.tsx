import React, {useEffect, useState} from 'react';
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
import {apikey, eventDetails} from '../api/apicalls';
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

const getDate = (date: string) => {
  const currentDate = new Date(date);
  return currentDate.toDateString();
};

const getTime = (date: string) => {
  const currentDate = new Date(date);
  return `${currentDate.getHours()}:${currentDate.getMinutes()}`;
};

const MovieDetailsScreen = ({navigation, route}: any) => {
  const [eventData, setEventData] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      const tempEventData = await getEventDetails(route.params.movieid);
      console.log(tempEventData);
      setEventData(tempEventData);
    })();
  }, []);

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
          source={{
            uri: eventData.BackgroundImg[0].signedUrl,
          }}
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
          {getDate(eventData?.Date)}{' '}
          {getTime(eventData?.Date)}
        </Text>
      </View>

      <View>
        <Text style={styles.title}>{eventData?.Name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.rateContainer}>
          <CustomIcon name="star" style={styles.starIcon} />
          <Text style={styles.runtimeText}>
            {eventData?.TotalSeat}
          </Text>
          <Text style={styles.runtimeText}>
            {eventData?.Date.substring(8, 10)}{' '}
            {new Date(eventData?.Date).toLocaleString('default', {
              month: 'long',
            })}{' '}
            {eventData?.Date.substring(0, 4)}
          </Text>
        </View>
        <Text style={styles.descriptionText}>{eventData?.Desc}</Text>
      </View>

      <View>
        <View>
          <TouchableOpacity
            style={styles.buttonBG}
            onPress={() => {
              navigation.push('SeatBooking', {
                BgImage: eventData.BackgroundImg[0].signedUrl,
                PosterImage: eventData.PosterImg[0].signedUrl,
              });
            }}>
            <Text style={styles.buttonText}>Select Seats</Text>
          </TouchableOpacity>
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
