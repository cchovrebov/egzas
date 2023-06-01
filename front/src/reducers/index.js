import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../pages/Posts/PostsList/postsSlice'
import likedPostsReducer from '../pages/Posts/LikedPosts/likedPostsSlice'
import postsApproveReducer from '../pages/Posts/PostsApprove/postsApproveSlice'
import postCreateReducer from '../pages/Posts/PostCreate/postCreateSlice'
import postEditReducer from '../pages/Posts/PostEdit/postEditSlice'
import categoriesReducer from '../pages/Cotegories/CategoriesList/categoriesSlice'
import userReducer from '../userSlice'

export default configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  reducer: {
    postsApproveReducer,
    likedPostsReducer,
    postCreateReducer,
    categoriesReducer,
    postEditReducer,
    postsReducer,
    userReducer,
  },
})