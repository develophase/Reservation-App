const BASE_URL: string = 'https://app.nocodb.com/api/v1/db/data/noco';
const EVENT_URL: string = 'https://app.nocodb.com/api/v2/tables/mwu56sppizrkiya/records';
const ACCOUNT_URL: string = 'https://app.nocodb.com/api/v2/tables/m7vm0tg07gje478/records';
const RESERVATION_URL: string = 'https://app.nocodb.com/api/v2/tables/m9yuay09dgnkd2i/records';
const ANNOUNCEMENT_URL: string = 'https://app.nocodb.com/api/v2/tables/mtrg0ths6noz89o/records'; 

export const apikey: string = '2LDRJE3zbiKS_05EZ5as85ZghFLMWOrdBrU_kNDo';
export const nearbyEvents = (offset: number, limit: number, where: string) => {
  return `${BASE_URL}/p9nchx72w7ehalc/mwu56sppizrkiya/views/vwr2ue4nanhwft71?offset=${offset}&limit=${limit}&where=${where}`;
}
export const eventDetails = (id: number) => {
  return `${EVENT_URL}/${id}`;
}
export const getAccountsByParams = (offset: number, limit: number, where: string ) => {
  return `${ACCOUNT_URL}?offset=${offset}&limit=${limit}&where=${where}`;
}
export const bookedSeatByEventIds = (offset: number, limit: number, where: string) => {
  return `${RESERVATION_URL}?offset=${offset}&limit=${limit}&where=${where}`;
} 
export const createBookedSeat = () => {
  return `${RESERVATION_URL}`;
}
export const getEventTicketBookedByUser = (offset: number, limit: number, where: string) => {
  return `${RESERVATION_URL}?offset=${offset}&limit=${limit}&where=${where}`;
}
export const registerUser = () => {
  return `${ACCOUNT_URL}`;
}
export const latestAnnoucement = (offset: number, limit: number, sort: string) => {
  return `${ANNOUNCEMENT_URL}?offset=${offset}&limit=${limit}&sort=${sort}`;
}

