import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getPost } from '../../../services/post'
import { useSelector } from 'react-redux';
import Navigation from '../../../components/Navigation/Navigation';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Link from '@mui/material/Link';
import { useParams } from 'react-router-dom';
import _ from 'lodash'

const theme = createTheme();

function PostView() {
  const userReducer = useSelector((state) => state.userReducer);
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getPost(id).then((data) => setPost({
        ...data,
        images: _.map(
          _.split(data.images, '[SEPARATOR]'),
          data_url => ({ data_url })
        ),
      })).catch(error => alert(error.message))
    }
  }, [id])

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
              {post ? (

                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">

                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {post.description}
                    </Typography>
                    <ImageList sx={{ width: 500, height: 150 }} cols={3} rowHeight={150}>
                      {post.images.map((item) => (
                        <ImageListItem key={item.data_url}>
                          <img
                            src={item.data_url || '/default.jpg'}
                            srcSet={item.data_url || '/default.jpg'}
                            alt="alt"
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <strong>Price:</strong>
                          {` ${post.price}$`}
                        </Typography>
                        {(userReducer.user.role === 'admin' || userReducer.user.id === post.user) && (
                          <Button size="small">
                            <Link href={`/post/${post.id}/edit`} variant="body2">
                              Edit
                            </Link>
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>

  );
}

export default PostView;
