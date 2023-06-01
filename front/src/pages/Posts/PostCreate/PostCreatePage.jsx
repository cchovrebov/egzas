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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Upload from '../../../components/Upload/Upload'
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useSelector, useDispatch } from 'react-redux'
import { setPost, initialError, setError, setLoadingPostCreate } from './postCreateSlice';
import { setCategories, setLoading } from '../../Cotegories/CategoriesList/categoriesSlice';
import { getCategories } from '../../../services/category';
import { createPost } from '../../../services/post';
import LinearProgress from '@mui/material/LinearProgress';
import _ from 'lodash';

const theme = createTheme();

const PostCreatePage = () => {
  const {
    postCreateReducer,
    categoriesReducer,
  } = useSelector((state) => state);
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
    dispatch(setPost({ inputName, value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      title,
      price,
      category,
    } = postCreateReducer.post

    const error = { ...initialError };
    let hasError = false;
    if (!title) {
      error.title = { ...initialError.title, show: true };
      hasError = true;
    }
    if (!price) {
      error.price = { ...initialError.price, show: true };
      hasError = true;
    }
    if (!category) {
      error.category = { ...initialError.category, show: true };
      hasError = true;
    }

    if (hasError) {
      return dispatch(setError(error))
    }

    dispatch(setLoadingPostCreate(true))
    const createdPost = await createPost(postCreateReducer.post);
    createdPost.images = _.map(
      _.split(createdPost.images, '[SEPARATOR]'),
      data_url => ({ data_url })
    );
    alert('Post created successfully, wait admin approval')
    dispatch(setLoadingPostCreate(false))
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
                width: '100%'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <AddCardIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Create post
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
                    error={postCreateReducer?.error?.title?.show}
                    helperText={postCreateReducer?.error?.title?.show ? postCreateReducer.error.title.message : ''}
                    onInput={(e) => handleInputChange(e.target.value, 'title')}
                  />
                </FormControl>
                <FormControl style={{ width: '100%', marginTop: '12px' }}>
                  <TextField
                    type="number"
                    margin="normal"
                    required
                    fullWidth
                    id="price"
                    label="Price"
                    name="price"
                    autoComplete="price"
                    autoFocus
                    InputProps={{ inputProps: { min: 0, max: 1000000 } }}
                    error={postCreateReducer?.error?.price?.show}
                    helperText={postCreateReducer?.error?.price?.show ? postCreateReducer.error.price.message : ''}
                    onInput={(e) => handleInputChange(e.target.value, 'price')}

                  />
                </FormControl>
                <FormControl style={{ width: '100%', marginTop: '25px', marginBottom: '25px' }}>
                  <InputLabel id="category">Category</InputLabel>
                  <Select
                    labelId="category"
                    id="category"
                    error={postCreateReducer?.error?.category?.show}
                    label="Category"
                    onChange={(e) => handleInputChange(e.target.value, 'category')}
                    value={postCreateReducer.post.category}
                  >
                    {categoriesReducer.isLoading ?
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                      </Box>
                      : null}
                    {!categoriesReducer.isLoading ? _.map(
                      _.orderBy(categoriesReducer.categories, ['title'], ['asc']),
                      (category) => (
                        <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                      )) : null}
                  </Select>
                </FormControl>
                <FormControl style={{ width: '100%', marginBottom: '25px' }}>
                  <TextareaAutosize
                    minRows={6}
                    placeholder="Description"
                    id="description"
                    style={{ width: '100%', resize: 'none', padding: '16px' }}
                    onChange={(e) => handleInputChange(e.target.value, 'description')}
                  />
                </FormControl>
                <FormControl style={{ width: '100%', marginBottom: '12px' }}>
                  <Upload
                    id="images"
                    onImgChange={(value) => handleInputChange(value, 'images')}
                    images={postCreateReducer.post.images}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Create
                </Button>
                {postCreateReducer.isLoading ?
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                  : null}
              </Box>
            </Box>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default PostCreatePage;
