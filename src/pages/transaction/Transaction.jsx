import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Box, Typography, Card, CardContent, Button, Chip
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { 
  fetchTransactionHistory, 
  resetHistory 
} from '../../features/transaction/transactionSlice';

const Transaction = () => {
  const dispatch = useDispatch();
  const { history, currentOffset, hasMore, loading } = useSelector(
    (state) => state.transaction
  );

  const LIMIT = 5;

  // load initial data
  useEffect(() => {
    dispatch(resetHistory());
    dispatch(fetchTransactionHistory({ offset: 0, limit: LIMIT }));
  }, [dispatch]);

  const handleShowMore = () => {
    const newOffset = currentOffset + LIMIT;
    dispatch(fetchTransactionHistory({ offset: newOffset, limit: LIMIT }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
          Semua Transaksi
        </Typography>

        {history.length === 0 && !loading ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Belum ada transaksi
          </Typography>
        ) : (
          <>
            {history.map((transaction, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {transaction.transaction_type === 'TOPUP' ? (
                          <Add sx={{ color: 'success.main', mr: 1 }} />
                        ) : (
                          <Remove sx={{ color: 'error.main', mr: 1 }} />
                        )}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: transaction.transaction_type === 'TOPUP' ? 'success.main' : 'error.main'
                          }}
                        >
                          {transaction.transaction_type === 'TOPUP' ? '+' : '-'} 
                          {formatCurrency(transaction.total_amount)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(transaction.created_on)}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {transaction.description}
                      </Typography>
                    </Box>

                    <Chip 
                      label={transaction.transaction_type}
                      size="small"
                      color={transaction.transaction_type === 'TOPUP' ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}

            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
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