'use client';

import { NextPage } from 'next';
import Table from './components/Table/Table';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import {
  storeAllBusinesses,
  StoredBusiness,
  storeNewBusinesses,
} from '@/store/slices/businesses';
import { useSelector } from 'react-redux';
import { BUSINESS_COLUMNS, REVIEWS_COLUMNS } from '@/utils/frontend/globals';
import { Box, Typography } from '@mui/material';
import { storeAllReviews, storeNewReviews } from '@/store/slices/reviews';
import { Review } from '@/utils/frontend/utils';
import Chat from './components/Chat/Chat';
import { Button } from '@mui/material';

const App: NextPage = () => {
  const { businesses, isLoading: isBusinessLoading } = useSelector(
    (state: {
      businesses: { businesses: StoredBusiness[]; isLoading: boolean };
    }) => state.businesses
  );
  const { reviews, isLoading: isReviewsLoading } = useSelector(
    (state: { reviews: { reviews: Review[]; isLoading: boolean } }) =>
      state.reviews
  );

  const generateNewBusinesses = async (_: React.MouseEvent) => {
    storeNewBusinesses(dispatch);
  };

  const generateNewReviews = async (_: React.MouseEvent) => {
    storeNewReviews(dispatch);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    storeAllBusinesses(dispatch);
    storeAllReviews(dispatch);
  }, [dispatch]);
  return (
    <>
      <Typography component="h1" variant="h3">
        Business Recommendation Application
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mt: '20px', // Margin-top
          mb: '20px', // Margin-bottom
        }}
      >
        <Typography component="h2" variant="h4">
          List of the existing businesses
        </Typography>
        <Button
          variant="contained"
          onClick={generateNewBusinesses}
          disabled={isBusinessLoading}
        >
          Generate new businesses
        </Button>
      </Box>
      <Table
        rows={businesses}
        columns={BUSINESS_COLUMNS}
        loading={isBusinessLoading}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mt: '20px', // Margin-top
          mb: '20px', // Margin-bottom
        }}
      >
        <Typography component="h2" variant="h4">
          List of the existing reviews
        </Typography>
        <Button
          variant="contained"
          onClick={generateNewReviews}
          disabled={isReviewsLoading}
        >
          Generate new reviews
        </Button>
      </Box>
      <Table
        rows={reviews}
        columns={REVIEWS_COLUMNS}
        loading={isReviewsLoading}
      />
      <Chat />
    </>
  );
};

export default App;
