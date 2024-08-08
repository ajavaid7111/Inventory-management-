'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, TextField, IconButton,
  ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar,
  Card, CardContent, CardActions, Grid, Snackbar, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Add, Remove, Inventory2, Delete } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const MotionContainer = motion(Container);
const MotionCard = motion(Card);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const updateInventory = async () => {
    try {
      setLoading(true);
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setSnackbar({ open: true, message: 'Failed to fetch inventory. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (e, itemToAdd = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    let name, quantity;

    if (itemToAdd) {
      name = itemToAdd.id;
      quantity = itemToAdd.quantity;
    } else {
      name = itemName.trim();
      quantity = itemQuantity;
    }

    if (!name) {
      setSnackbar({ open: true, message: 'Please enter an item name.' });
      return;
    }

    try {
      const docRef = doc(collection(firestore, 'inventory'), name.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingQuantity = docSnap.data().quantity;
        await setDoc(docRef, { quantity: existingQuantity + quantity });
      } else {
        await setDoc(docRef, { quantity: quantity });
      }
      await updateInventory();
      setSnackbar({ open: true, message: `Added ${quantity} ${name}(s) to inventory.` });
      if (!itemToAdd) {
        setItemName('');
        setItemQuantity(1);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbar({ open: true, message: 'Failed to add item. Please try again.' });
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
      setSnackbar({ open: true, message: `Removed 1 ${item.id} from inventory.` });
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({ open: true, message: 'Failed to remove item. Please try again.' });
    }
  };

  const deleteItem = async (item) => {
    try {
      await deleteDoc(doc(collection(firestore, 'inventory'), item.id));
      await updateInventory();
      setSnackbar({ open: true, message: `Deleted ${item.id} from inventory.` });
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbar({ open: true, message: 'Failed to delete item. Please try again.' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Inventory2 sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Inventory Management System
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <MotionContainer 
        maxWidth="md" 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box my={4}>
          <form onSubmit={addItem}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Item Name"
                  variant="outlined"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  variant="outlined"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  type="submit"
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Inventory Items
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            <Grid container spacing={3}>
              {inventory.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <MotionCard
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => removeItem(item)} color="primary">
                        <Remove />
                      </IconButton>
                      <IconButton onClick={() => addItem(null, { id: item.id, quantity: 1 })} color="primary">
                        <Add />
                      </IconButton>
                      <IconButton onClick={() => deleteItem(item)} color="secondary">
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
      </MotionContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </ThemeProvider>
  );
}
