import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const HTTP_HEADERS = {
    Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}`,
};
const photoUrl = `https://api.unsplash.com`;

// Get Default Photos
export const getPhotos = createAsyncThunk(
    "photoGallery/getPhotos",
    async (requestParams) => {
        const response = await axios.get(`${photoUrl}/photos`, {
            headers: HTTP_HEADERS,
            params: { ...requestParams },
        });
        const data = response.data;

        return { requestParams, data };
    }
);

// Get Search Photos
export const searchPhotos = createAsyncThunk(
    "photoGallery/searchPhotos",
    async (requestParams) => {
        const response = await axios.get(`${photoUrl}/search/photos`, {
            headers: HTTP_HEADERS,
            params: { ...requestParams },
        });
        const data = response.data;

        return { requestParams, data };
    }
);

// Get Photos by topic
export const getPhotosByTopic = createAsyncThunk(
    "photoGallery/getPhotosByTopic",
    async ({ requestParams, topic }) => {
        const response = await axios.get(`${photoUrl}/topics/${topic}/photos`, {
            headers: HTTP_HEADERS,
            params: { ...requestParams },
        });
        const data = response.data;

        return { requestParams, data, topic };
    }
);

// Get List of topics
export const getListOfTopics = createAsyncThunk(
    "photoGallery/getListOfTopics",
    async () => {
        const response = await axios.get(`${photoUrl}/topics`, {
            headers: HTTP_HEADERS,
        });
        const data = response.data;

        return data;
    }
);

// Add entity adapter to hold existing photos
const sliceAdapter = createEntityAdapter({
    selectId: (entity) => entity.id,
});

export const { selectAll } = sliceAdapter.getSelectors(
    (state) => state.photoGalleryReducer
);

export const photoGallery = createSlice({
    name: "photoGallery",
    initialState: sliceAdapter.getInitialState({
        isLoading: false,
        photos: [],
        topics: [],
        topic: [],
        request: {
            per_page: 15, // initial at 15
            page: 1,
            query: "",
            order_by: null,
        },
        ref: "default",
    }),
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload.loading;
            state.loadingRef = action.payload.ref;
        },
    },
    extraReducers: {
        // Default photos extra reducer
        [getPhotos.pending]: (state, action) => {
            state.isLoading = true;
        },
        [getPhotos.fulfilled]: (state, action) => {
            state.isLoading = false;

            const { requestParams, data } = action.payload;
            state.request = requestParams;
            if (state.ref === "default") {
                sliceAdapter.addMany(state, data);
            } else {
                sliceAdapter.setAll(state, data);
            }

            state.ref = "default";
        },
        [getPhotos.rejected]: (state, action) => {
            state.isLoading = false;
        },

        // Photos by search extra reducer
        [searchPhotos.pending]: (state, action) => {
            state.isLoading = true;
        },
        [searchPhotos.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.ref = "search";

            const { requestParams, data } = action.payload;
            if (
                state.request.query !== requestParams.query ||
                state.request.order_by !== requestParams.order_by
            ) {
                sliceAdapter.setAll(state, data.results);
            } else {
                sliceAdapter.addMany(state, data.results);
            }

            state.request = requestParams;
        },
        [searchPhotos.rejected]: (state, action) => {
            state.isLoading = false;
        },

        // Photos by topic extra reducer
        [getPhotosByTopic.pending]: (state, action) => {
            state.isLoading = true;
        },
        [getPhotosByTopic.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.ref = "topic";

            const { requestParams, data, topic } = action.payload;
            if (state.topic !== topic) {
                sliceAdapter.setAll(state, data);
            } else {
                sliceAdapter.addMany(state, data);
            }

            state.request = requestParams;
            state.topic = topic;
        },
        [getPhotosByTopic.rejected]: (state, action) => {
            state.isLoading = false;
        },

        // Get list of topics extra reducer
        [getListOfTopics.fulfilled]: (state, action) => {
            state.topics = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setLoading } = photoGallery.actions;

export default photoGallery.reducer;
