import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import PostsPage from "./pages/Posts/PostsList/PostsPage";
import LikedPostsPage from "./pages/Posts/LikedPosts/LikedPostsPage";
import PostCreatePage from "./pages/Posts/PostCreate/PostCreatePage";
import PostEditPage from "./pages/Posts/PostEdit/PostEditPage";
import SignIn from "./pages/Sign-in/SignIn";
import SignUp from "./pages/Sign-up/SignUp";
import Page404 from "./pages/Error/404";
import PostsApprove from "./pages/Posts/PostsApprove/PostsApprove";
import PostView from './pages/Posts/PostView/PostView'
import CategoriesList from "./pages/Cotegories/CategoriesList/CategoriesList";
import { getLikedPosts } from './services/post';
import { useSelector, useDispatch } from 'react-redux';
import { validate } from './services/user';
import { setUser } from './userSlice';
import { setPosts } from './pages/Posts/LikedPosts/likedPostsSlice';

function App() {
  const userReducer = useSelector((state) => state.userReducer);
  const dispatch = useDispatch()
  const isAuthenticated = !!userReducer.token;

  useEffect(() => {
    validate().then(data => {
      dispatch(setUser({ inputName: 'username', value: data.username }))
      dispatch(setUser({ inputName: 'email', value: data.email }))
      dispatch(setUser({ inputName: 'id', value: data.id }))
      dispatch(setUser({ inputName: 'role', value: data.role }))
    })
    if (isAuthenticated) {
      getLikedPosts().then(data => dispatch(setPosts(data)))
    }
  }, [dispatch, isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ?
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </>
          :
          <>
            <Route path="/" element={<PostsPage />} />
            <Route path="/create-post" element={<PostCreatePage />} />
            <Route path="/liked" element={<LikedPostsPage />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/post/:id/edit" element={<PostEditPage />} />
            {userReducer.user.role === 'admin' && (
              <>
                <Route path="/categories" element={<CategoriesList />} />
                <Route path="/approve" element={<PostsApprove />} />
              </>
            )}
          </>
        }
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;