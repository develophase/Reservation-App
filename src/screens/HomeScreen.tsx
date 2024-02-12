import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import {COLORS, SPACING} from '../theme/theme';
import {
  apikey,
  nearbyEvents,
} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import CategoryHeader from '../components/CategoryHeader';
import SubMovieCard from '../components/SubMovieCard';
import MovieCard from '../components/MovieCard';

const {width, height} = Dimensions.get('window');

const currentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

  const weekNumber = Math.ceil(days / 7);
  return weekNumber;
};

const currentYear = () => {
  const currentDate = new Date();

  return currentDate.getFullYear();
};

const getNearbyEventList = async (limit: number, offset: number, where: string) => {
  try {
    let options = {
      method: 'GET',
      headers: {
        'xc-token': apikey
      }
    };

    let response = await fetch(nearbyEvents(offset, limit, where), options);
    let json = await response.json();

    return json.list;
  } catch (error) {
    console.error(
      ' Something went wrong in getNowPlayingMoviesList Function',
      error,
    );
  }
};

const HomeScreen = ({navigation}: any) => {
  const [nearbyEventList, setNearbyEventList] = useState<any>(undefined);
  const [upcomingEventList, setUpcomingEventList] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      var weekNumber = currentWeekNumber(); 
      var year = currentYear();
      
      const query = `(Week,eq,${weekNumber})~and(Year,eq,${year})`;
      const queryUpcoming = `(Week,eq,${weekNumber+1})~and(Year,eq,${year})`;

      let tempNearbyEvent = await getNearbyEventList(100, 0, query);
      setNearbyEventList([...tempNearbyEvent]);

      let tempUpcoming = await getNearbyEventList(100, 0, queryUpcoming);
      setUpcomingEventList([...tempUpcoming]);
    })();
  }, []);

  const searchMoviesFunction = () => {
    navigation.navigate('Search');
  };

  if (
    nearbyEventList == undefined &&
    nearbyEventList == null &&
    upcomingEventList == undefined &&
    upcomingEventList == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar hidden />

        {/* <View style={styles.InputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View> */}

        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar hidden />
      
      {/* 
      <View style={styles.InputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View> 
      */}

      <CategoryHeader title={'Nearby Event'} />
      <FlatList
        data={nearbyEventList}
        keyExtractor={(item: any) => item.Id}
        bounces={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        contentContainerStyle={styles.containerGap36}
        renderItem={({item, index}) => {

          var date = item.Date ? new Date(item.Date) : new Date();
          if (!item.Name) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}></View>
            );
          }

          return (
            <MovieCard
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push('MovieDetails', {movieid: item.Id});
              }}
              cardWidth={width * 0.7}
              isFirst={index == 0 ? true : false}
              isLast={index == nearbyEventList?.length - 1 ? true : false}
              title={item.Name}
              imagePath={item.PosterImg ? item.PosterImg[0].signedUrl : ''}
              genre={[date.toDateString(), `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`]}
              vote_count={item.TotalSeat}
            />
          );
        }}
      />
      <CategoryHeader title={'Upcoming'} />
      <FlatList
        data={upcomingEventList}
        keyExtractor={(item: any) => item.Id}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({item, index}) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', {movieid: item.Id});
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingEventList?.length - 1 ? true : false}
            title={item.Name}
            imagePath={item.PosterImg ? item.PosterImg[0].signedUrl : ''}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default HomeScreen;
