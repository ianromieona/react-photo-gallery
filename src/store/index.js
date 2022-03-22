import { configureStore } from "@reduxjs/toolkit";
import photoGalleryReducer from "../components/PhotoGallery/store/photoGallerySlice";

export default configureStore({
    reducer: {
        photoGalleryReducer,
    },
});
