import { useEffect } from 'react';
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
import Navigation from '../../../components/Navigation/Navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, publishPost, removePost } from '../../../services/post';
import { setLoading, setPosts } from './postsApproveSlice';
import _ from 'lodash'

const theme = createTheme();

const PostsApprove = () => {
  const postsApproveReducer = useSelector((state) => state.postsApproveReducer);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    getPosts()
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
      }).catch(() => dispatch(setLoading(false)))
  }, [dispatch])


  const handlePublishClick = async (adId) => {
    await publishPost(adId);
    dispatch(setPosts(
      _.filter(
        postsApproveReducer.posts,
        post => post.id !== adId
      )
    ))
  };

  const handlePostRemove = async (postId) => {
    await removePost(postId);
    const posts = _.filter(postsApproveReducer.posts, post => post.id !== postId);
    dispatch(setPosts(posts))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <main>
        <Container
          sx={{
            bgcolor: 'background.paper',
            mt: 8,
            mb: 6,
          }} maxWidth="md">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {_.map(
                _.orderBy(postsApproveReducer.posts, ['createdAt'], ['desc']),
                (post) => (
                  <Card
                    key={post.id}
                    sx={{ height: '189px', display: 'flex', flexDirection: 'column', margin: '1rem' }}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image={_.get(post, 'images.0.data_url') || '/default.jpg'}
                          alt="random"
                        />

                      </Grid>
                      <Grid item xs={8}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              {post.title}
                            </span>
                            <span>
                              {`${post.price}$`}
                            </span>
                          </Typography>
                          <Typography>
                            {post.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button onClick={() => handlePublishClick(post.id)} size="small">Publish</Button>
                          <Button onClick={() => handlePostRemove(post.id)} size="small">Remove</Button>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default PostsApprove;
