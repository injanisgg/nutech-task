import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import {
  fetchTransactionHistory,
  resetHistory,
} from '../../features/transaction/transactionSlice';

const Transaction = () => {
  const dispatch = useDispatch();
  const { history, currentOffset, hasMore, loading } = useSelector(
    (state) => state.transaction
  );

  const LIMIT = 5;

  useEffect(() => {
    dispatch(resetHistory());
    dispatch(fetchTransactionHistory({ offset: 0, limit: LIMIT }));
  }, [dispatch]);

  const handleShowMore = () => {
    dispatch(
      fetchTransactionHistory({
        offset: currentOffset + LIMIT,
        limit: LIMIT,
      })
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '1.4rem', md: '1.6rem' },
          }}
        >
          Semua Transaksi
        </Typography>

        {history.length === 0 && !loading ? (
          <Typography
            align="center"
            color="text.secondary"
            sx={{ py: 6 }}
          >
            Belum ada transaksi
          </Typography>
        ) : (
          <>
            {history.map((transaction, index) => {
              const isTopUp = transaction.transaction_type === 'TOPUP';

              return (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      justifyContent="space-between"
                    >
                      {/* Left content */}
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {isTopUp ? (
                            <Add sx={{ color: 'success.main' }} />
                          ) : (
                            <Remove sx={{ color: 'error.main' }} />
                          )}

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: isTopUp
                                ? 'success.main'
                                : 'error.main',
                              fontSize: { xs: '1rem', md: '1.1rem' },
                            }}
                          >
                            {isTopUp ? '+' : '-'}
                            {formatCurrency(transaction.total_amount)}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {formatDate(transaction.created_on)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5 }}
                        >
                          {transaction.description}
                        </Typography>
                      </Box>

                      {/* Right badge */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        }}
                      >
                        <Chip
                          label={transaction.transaction_type}
                          size="small"
                          color={isTopUp ? 'success' : 'default'}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}

            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleShowMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Show more'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Transaction;