import { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navigation from '../../../components/Navigation/Navigation';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import AddCardIcon from '@mui/icons-material/AddCard';
import FormControl from '@mui/material/FormControl';
import { useSelector, useDispatch } from 'react-redux'
import { setCategory, setCategories, setLoading, initialError, setError } from './categoriesSlice';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import _ from 'lodash';
import { getCategories, createCategory, removeCategory } from '../../../services/category'
import LinearProgress from '@mui/material/LinearProgress';

const theme = createTheme();

const CategoriesList = () => {
  const categoriesReducer = useSelector((state) => state.categoriesReducer);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    getCategories()
      .then(data => {
        dispatch(setCategories(data))
        dispatch(setLoading(false))
      }).catch(() => {
        dispatch(setLoading(false))
      })
  }, [dispatch])

  const handleInputChange = (value, inputName) => {
    dispatch(setCategory({ inputName, value }))
  }

  const handleRemove = async (id) => {
    dispatch(setLoading(true))
    try {
      await removeCategory(id);
      dispatch(setCategories(
        _.filter(
          categoriesReducer.categories,
          category => category.id !== id
        )
      ))
    } catch (error) {
      alert('Something went wrong!')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      title,
    } = categoriesReducer.category

    const error = { ...initialError };
    dispatch(setError(error))
    let hasError = false;
    if (!title) {
      error.title = { ...initialError.title, show: true };
      hasError = true;
    }

    if (hasError) {
      return dispatch(setError(error))
    }


    try {
      dispatch(setLoading(true))
      const createdCategory = await createCategory(categoriesReducer.category);
      dispatch(setCategories([
        ...categoriesReducer.categories,
        createdCategory,
      ]))
    } catch (error) {
      alert(error.message)
    } finally {
      dispatch(setLoading(false))
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>

        <Container
          sx={{
            bgcolor: 'background.paper',
            mt: 12,
            mb: 12,
            xs: 12,
          }} maxWidth="xs">
          <Grid container spacing={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <AddCardIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Create category
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit}
                style={{ width: '100%' }}>
                <FormControl style={{ width: '100%', marginTop: '12px' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    error={categoriesReducer?.error?.title?.show}
                    helperText={categoriesReducer?.error?.title?.show ? categoriesReducer.error.title.message : ''}
                    onInput={(e) => handleInputChange(e.target.value, 'title')}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Grid>
          <Container

            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
            <List style={{
              margin: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {categoriesReducer.isLoading ?
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>
                : null}
              {
                !categoriesReducer.isLoading && categoriesReducer.categories
                  ? _.map(
                    _.orderBy(categoriesReducer.categories, ['updatedAt'], ['desc']),
                    (category) => (
                      <ListItem
                        key={category.id}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(category.id)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={category.title}
                        />
                      </ListItem>
                    )) : null
              }
            </List>
          </Container>
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default CategoriesList;
