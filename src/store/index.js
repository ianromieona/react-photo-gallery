import { configureStore } from "@reduxjs/toolkit";
import photoGalleryReducer from "../components/PhotoGallery/store/photoGallerySlice";

export default configureStore({
    reducer: {
        photoGalleryReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        });
    },
});
