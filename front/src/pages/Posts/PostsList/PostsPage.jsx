import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Navigation from '../../../components/Navigation/Navigation';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { getPublishedPosts, likePost, removeLike, removePost } from '../../../services/post';
import { setLoading, setPosts } from './postsSlice';
import { setPosts as setLikedPosts } from '../LikedPosts/likedPostsSlice';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { setCategories } from '../../Cotegories/CategoriesList/categoriesSlice';
import { getCategories } from '../../../services/category';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import _ from 'lodash'

const theme = createTheme();
const filter = createFilterOptions();

const PostsPage = () => {
  const [value, setValue] = useState(null);
  const [fiteredPosts, setFiteredPosts] = useState(null);
  const {
    postsReducer,
    categoriesReducer,
    likedPostsReducer,
    userReducer
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    getPublishedPosts()
      .then(data => {
        const mappedData = _.map(data, (post) => ({
          ...post,
          images: _.map(
            _.split(post.images, '[SEPARATOR]'),
            data_url => ({ data_url })
          ),
        }))
        dispatch(setPosts(mappedData))
        dispatch(setLoading(false))
      })
    getCategories()
      .then(data => {
        dispatch(setCategories(data))
      })
  }, [dispatch])

  useEffect(() => {
    if (value) {
      const filtered = _.filter(postsReducer.posts, (post) => post.category === value.id)
      setFiteredPosts(filtered)
    } else {
      setFiteredPosts(postsReducer.posts)
    }
  }, [value, postsReducer.posts])

  const handleLike = async (postId) => {
    const likedPost = await likePost({ postId });
    dispatch(setLikedPosts([
      likedPost,
      ...likedPostsReducer.posts
    ]));
  }

  const handleUnlike = async (postId) => {
    await removeLike(postId);
    const likedPosts = _.filter(likedPostsReducer.posts, post => post.id !== postId);
    dispatch(setLikedPosts(likedPosts));
  }

  const handlePostRemove = async (postId) => {
    await removePost(postId);
    const posts = _.filter(postsReducer.posts, post => post.id !== postId);
    dispatch(setPosts(posts))
  }

  const handleSearch = async (text) => {
    const filtered = _.filter(postsReducer.posts, (post) => _.includes(_.toLower(post.title), _.toLower(text))
      || _.includes(_.toLower(post.description), _.toLower(text)))
    setFiteredPosts(filtered)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        <Container style={{ marginTop: '30px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setValue({
                      title: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                      title: newValue.inputValue,
                    });
                  } else {
                    setValue(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.title);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={categoriesReducer.categories}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.title}</li>}
                sx={{ mb: 2, width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="title"
                label="Search by title and description"
                name="search"
                onInput={(e) => handleSearch(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            {_.size(fiteredPosts) ? _.map(
              _.orderBy(fiteredPosts, ['createdAt'], ['desc']),
              (post) => (
                <Grid item key={post.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      image={_.get(post, 'images.0.data_url') || '/default.jpg'}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          {post.title}
                        </span>
                        <span>
                          {`${post.price}$`}
                        </span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {_.find(likedPostsReducer.posts, { id: post.id }) ? (
                        <IconButton onClick={() => handleUnlike(post.id)}>
                          <StarIcon color="warning" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleLike(post.id)}>
                          <StarBorderIcon color="warning" />
                        </IconButton>
                      )}
                      <Button size="small">
                        <Link href={`/post/${post.id}`} variant="body2">
                          View
                        </Link>
                      </Button>
                      {(userReducer.user.role === 'admin' || userReducer.user.id === post.user) && (
                        <Button size="small">
                          <Link href={`/post/${post.id}/edit`} variant="body2">
                            Edit
                          </Link>
                        </Button>
                      )}
                      {(userReducer.user.role === 'admin' || userReducer.user.id === post.user) && (
                        <Button onClick={() => handlePostRemove(post.id)} size="small">
                          Remove
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              )) : <Grid item xs={12}>No data available</Grid>}
          </Grid>
        </Container>
      </main>
    </ThemeProvider >
  );
}

export default PostsPage;
