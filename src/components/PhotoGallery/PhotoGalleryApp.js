import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useParams, useNavigate } from "react-router-dom";

// UI
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

// Store
import {
    searchPhotos,
    getPhotos,
    getPhotosByTopic,
    selectAll,
} from "./store/photoGallerySlice";

// Components
import PhotoGalleryTopics from "./PhotoGalleryTopics";

function PhotoGalleryApp() {
    const { innerHeight: height } = window;
    const dispatch = useDispatch();
    const rootRef = useRef(null);
    const routerParams = useParams();
    const navigate = useNavigate();

    const [resource, setResource] = useState("default");
    const [searchText, setSearchText] = useState("");
    const [debouncedText] = useDebounce(searchText, 300);

    const photoGallery = useSelector((state) => state.photoGalleryReducer);
    const photos = useSelector(selectAll);

    // Handles initial search photos, topic photos and default photos
    useEffect(() => {
        const { search, topic } = routerParams;
        const requestParams = {
            ...photoGallery.request,
            query: search ?? null,
        };
        if (typeof search !== "undefined") {
            setResource("search");

            requestParams.page = 1;
            dispatch(searchPhotos(requestParams));
        } else if (typeof topic !== "undefined") {
            setResource("topics");
            setSearchText("");
            requestParams.page = 1;
            dispatch(getPhotosByTopic({ requestParams, topic }));
        } else {
            setResource("default");

            dispatch(getPhotos(requestParams));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, routerParams]);

    // Navigate search
    useEffect(() => {
        if (debouncedText) {
            navigate("/q/" + debouncedText);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedText]);

    // Handle fetching more photos
    const getMore = () => {
        const { search, topic } = routerParams;
        console.log(search, topic);
        const requestParams = {
            ...photoGallery.request,
            per_page: 10,
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

    // Handle Infinite scroll
    const handleScroll = (e) => {
        console.log("a");
        const bottom =
            rootRef.current.scrollHeight - rootRef.current.scrollTop <=
            rootRef.current.clientHeight;

        if (bottom && !photoGallery.isLoading) getMore();
    };

    return (
        <div>
            <div style={{ padding: "10px" }}>
                <TextField
                    id="outlined"
                    label="Search"
                    variant="outlined"
                    onChange={(ev) => setSearchText(ev.target.value)}
                    className="w-full mx-10"
                    value={searchText}
                />
                <PhotoGalleryTopics />
            </div>
            <div
                ref={rootRef}
                onScroll={handleScroll}
                style={{ height: `${height}px`, overflow: "auto" }}
            >
                <ImageList cols={3}>
                    {photos.map((item) => (
                        <ImageListItem key={item.id}>
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
}

export default React.memo(PhotoGalleryApp);
