import { GridColDef } from '@mui/x-data-grid';

export const API_URL = '/api';

export const BUSINESS_URL = API_URL + '/businesses';

export const REVIEW_URL = API_URL + '/reviews';

export const RECOMMENDATIONS_URL = API_URL + '/recommendations';

export const BUSINESS_COLUMNS: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 220 },
  { field: 'type', headerName: 'Type', width: 180 },
  {
    field: 'street',
    headerName: 'Street',
    width: 230,
  },
  {
    field: 'postalCode',
    headerName: 'Postal Code',
    width: 70,
  },
  {
    field: 'city',
    headerName: 'City',
    width: 150,
  },
  {
    field: 'state',
    headerName: 'State',
    width: 150,
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 100,
  },
  {
    field: 'openingHour',
    headerName: 'Opening',
    width: 100,
  },
  {
    field: 'closingHour',
    headerName: 'Closing',
    width: 100,
  },
];

export const REVIEWS_COLUMNS: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
  },
  { field: 'businessId', headerName: 'Rated Business ID', width: 200 },
  { field: 'username', headerName: 'Username', width: 200 },
  { field: 'rating', headerName: 'Rating', width: 70 },
  { field: 'comment', headerName: 'Comment', width: 400 },
];
