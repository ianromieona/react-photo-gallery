import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useParams, useNavigate } from "react-router-dom";

// UI
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

// Store
import {
    searchPhotos,
    getPhotos,
    getPhotosByTopic,
    selectAll,
} from "./store/photoGallerySlice";

// Partials Components
import PhotoGalleryTopics from "./PhotoGalleryTopics";
import PhotoGallerySort from "./PhotoGallerySort";

/**
 * General file for Photo Gallery App
 */
const PhotoGalleryApp = () => {
    const { innerHeight: height } = window;
    const dispatch = useDispatch();
    const rootRef = useRef(null);
    const routerParams = useParams();
    const navigate = useNavigate();

    const [resource, setResource] = useState("default");
    const [sort, setSort] = useState("");
    const [searchText, setSearchText] = useState("");
    const [topic, setTopic] = useState(null);
    const [debouncedText] = useDebounce(searchText, 300);

    const photoGallery = useSelector((state) => state.photoGalleryReducer);
    const photos = useSelector(selectAll);

    // Handles initial search photos, topic photos and default photos
    useEffect(() => {
        const { search, topic } = routerParams;
        const requestParams = {
            ...photoGallery.request,
            page: 1,
        };

        // Handle search photos
        if (typeof search !== "undefined") {
            setResource("search");
            setTopic(null);

            requestParams.query = search ?? null;
            requestParams.order_by = sort ?? null;
            dispatch(searchPhotos(requestParams));

            // Handles topic photos
        } else if (typeof topic !== "undefined") {
            setResource("topics");
            setSearchText("");
            setTopic(topic);

            requestParams.order_by = null;
            requestParams.query = null;
            requestParams.page = 1;
            dispatch(getPhotosByTopic({ requestParams, topic }));

            // Handles initial set of photos
        } else {
            setResource("default");
            setSearchText("");
            setTopic(null);

            requestParams.order_by = null;
            requestParams.query = null;
            requestParams.page = 1;
            dispatch(getPhotos(requestParams));
        }
    }, [dispatch, routerParams, sort]);

    // Navigate search
    useEffect(() => {
        if (debouncedText) {
            navigate("/q/" + debouncedText);
        }
    }, [debouncedText]);

    // Handle fetching more photos
    const getMore = () => {
        const requestParams = {
            ...photoGallery.request,
            per_page: 15,
            page: photoGallery.request.page + 1,
        };

        switch (resource) {
            case "search":
                dispatch(searchPhotos(requestParams));
                break;
            case "topics":
                dispatch(getPhotosByTopic({ requestParams, topic }));
                break;
            case "default":
                dispatch(getPhotos(requestParams));
                break;
            default:
                break;
        }
    };

    // Handle Search sort
    const handleSort = (sortType) => {
        setSort(sortType);
    };

    // Handles scroll function to execute getMore function at bottom
    const handleScroll = (e) => {
        const bottom =
            rootRef.current.scrollHeight - rootRef.current.scrollTop <=
            rootRef.current.clientHeight;

        if (bottom && !photoGallery.isLoading) getMore();
    };

    return (
        <div>
            <div style={{ padding: "10px" }}>
                <Paper
                    component="form"
                    sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        mb: "10px",
                    }}
                >
                    <IconButton
                        sx={{ p: "10px" }}
                        aria-label="menu"
                        onClick={() => navigate("/")}
                    >
                        <HomeIcon />
                    </IconButton>
                    <InputBase
                        value={searchText}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Photos"
                        inputProps={{ "aria-label": "search photos" }}
                        onChange={(ev) => setSearchText(ev.target.value)}
                    />

                    <SearchIcon sx={{ p: "10px" }} />
                </Paper>
                {resource !== "search" && <PhotoGalleryTopics topic={topic} />}
            </div>

            {resource === "search" && photos && (
                <Typography
                    variant="h6"
                    component="div"
                    style={{ padding: "10px" }}
                >
                    Results found for `{photoGallery.request.query}`
                    <PhotoGallerySort
                        handleSort={handleSort}
                        sort={photoGallery.request.order_by}
                    />
                </Typography>
            )}

            <div
                ref={rootRef}
                onScroll={handleScroll}
                style={{ height: `${height}px`, overflow: "auto" }}
            >
                <ImageList cols={3}>
                    {photos.map((item) => (
                        <ImageListItem key={item.id} role="image">
                            <img
                                src={item?.urls?.regular}
                                srcSet={item?.urls?.regular}
                                alt={item?.alt_description}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>

                {photoGallery.isLoading && (
                    <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        align="center"
                        className="mx-10"
                    >
                        Fetching cool photos...
                    </Typography>
                )}
                {!photoGallery.isLoading && photos.length === 0 && (
                    <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        align="center"
                        className="mx-10"
                    >
                        No photos found.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default React.memo(PhotoGalleryApp);
