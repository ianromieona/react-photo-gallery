import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// Store
import { getListOfTopics } from "./store/photoGallerySlice";

const PhotoGalleryTopics = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const topics = useSelector((state) => state.photoGalleryReducer.topics);

    useEffect(() => {
        dispatch(getListOfTopics());
    }, [dispatch]);

    const handleChange = (event, newValue) => {
        navigate("/t/" + topics[newValue]?.slug);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={0}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
            >
                {topics.map((item, i) => (
                    <Tab value={i} label={item.title} key={i} />
                ))}
            </Tabs>
        </Box>
    );
};

export default React.memo(PhotoGalleryTopics);
