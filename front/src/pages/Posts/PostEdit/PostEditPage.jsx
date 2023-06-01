import { useEffect, useCallback } from 'react';
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
import { setPost, updatePost, initialError, setError, setLoadingPostEdit } from './postEditSlice';
import { setCategories, setLoading } from '../../Cotegories/CategoriesList/categoriesSlice';
import { getCategories } from '../../../services/category';
import { patchPost } from '../../../services/post';
import LinearProgress from '@mui/material/LinearProgress';
import { useParams } from 'react-router-dom';
import { getPost } from '../../../services/post'
import _ from 'lodash';

const theme = createTheme();

const PostEditPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getPost(id).then((data) => dispatch(setPost({
        ...data,
        images: _.map(
          _.split(data.images, '[SEPARATOR]'),
          data_url => ({ data_url })
        ),
      }))).catch(error => alert(error.message))
    }
  }, [dispatch, id])

  const {
    postEditReducer,
    categoriesReducer,
  } = useSelector((state) => state);

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

  const handleInputChange = useCallback((value, inputName) => {
    dispatch(updatePost({ inputName, value }))
  }, [dispatch])


  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      title,
      price,
      category,
    } = postEditReducer.post

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

    dispatch(setLoadingPostEdit(true))
    const updatedPost = await patchPost(id, postEditReducer.post);
    updatedPost.images = _.map(
      _.split(updatedPost.images, '[SEPARATOR]'),
      data_url => ({ data_url })
    );
    alert('Post updated successfully, wait admin approval')
    dispatch(setLoadingPostEdit(false))
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
          {postEditReducer.post && (
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
                  Update post
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
                      value={postEditReducer.post.title}
                      error={postEditReducer?.error?.title?.show}
                      helperText={postEditReducer?.error?.title?.show ? postEditReducer.error.title.message : ''}
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
                      value={postEditReducer.post.price}
                      InputProps={{ inputProps: { min: 0, max: 1000000 } }}
                      error={postEditReducer?.error?.price?.show}
                      helperText={postEditReducer?.error?.price?.show ? postEditReducer.error.price.message : ''}
                      onInput={(e) => handleInputChange(e.target.value, 'price')}

                    />
                  </FormControl>
                  <FormControl style={{ width: '100%', marginTop: '25px', marginBottom: '25px' }}>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                      labelId="category"
                      id="category"
                      error={postEditReducer?.error?.category?.show}
                      label="Category"
                      onChange={(e) => handleInputChange(e.target.value, 'category')}
                      value={postEditReducer.post.category}
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
                      value={postEditReducer.post.description}
                      style={{ width: '100%', resize: 'none', padding: '16px' }}
                      onChange={(e) => handleInputChange(e.target.value, 'description')}
                    />
                  </FormControl>
                  <FormControl style={{ width: '100%', marginBottom: '12px' }}>
                    <Upload
                      id="images"
                      onImgChange={(value) => handleInputChange(value, 'images')}
                      images={postEditReducer.post.images}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Update
                  </Button>
                  {postEditReducer.isLoading ?
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                    : null}
                </Box>
              </Box>
            </Grid>
          )}
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default PostEditPage;
