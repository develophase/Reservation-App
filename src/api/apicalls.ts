// const apikey: string = '753049c9feaee5416b7f1b3fe918f733';
// export const baseImagePath = (size: string, path: string) => {
//   return `https://image.tmdb.org/t/p/${size}${path}`;
// };
// export const nowPlayingMovies: string = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}`;
// export const upcomingMovies: string = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}`;
// export const popularMovies: string = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}`;
// export const searchMovies = (keyword: string) => {
//   return `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${keyword}`;
// };
// export const movieDetails = (id: number) => {
//   return `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}`;
// };
// export const movieCastDetails = (id: number) => {
//   return `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}`;
// };

const BASE_URL: string = 'https://app.nocodb.com/api/v1/db/data/noco/';
const EVENT_URL: string = 'https://app.nocodb.com/api/v2/tables/mwu56sppizrkiya/records';
const ACCOUNT_URL: string = 'https://app.nocodb.com/api/v2/tables/m7vm0tg07gje478/records';

export const apikey: string = 'RV6PSTATpTeRF31DtVxHzbmCIolzB1_-8YG49n2c';
export const nearbyEvents = (offset: number, limit: number, where: string) => {
  return `${BASE_URL}p9nchx72w7ehalc/mwu56sppizrkiya/views/vwr2ue4nanhwft71?offset=${offset}&limit=${limit}&where=${where}`;
}
export const eventDetails = (id: number) => {
  return `${EVENT_URL}/${id}`;
}
export const getAccountsByParams = (offset: number, limit: number, where: string ) => {
  return `${ACCOUNT_URL}?offset=${offset}&limit=${limit}&where=${where}`;
}

export const bookedSeatByEventIds: string = `${BASE_URL}p9nchx72w7ehalc/mwu56sppizrkiya/views/vw82rwc59mo3cd8y`;

