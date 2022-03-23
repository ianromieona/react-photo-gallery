import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

// Store
import { getListOfTopics } from "./store/photoGallerySlice";

const PhotoGalleryTopics = (props) => {
    const { topic } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tab, setTab] = useState(topic ?? "home-default");

    const topics = useSelector((state) => state.photoGalleryReducer.topics);

    // Get Topics
    useEffect(() => {
        if (topics.length === 0) {
            dispatch(getListOfTopics());
        }
    }, [dispatch]);

    // Set tab active when topic is active
    useEffect(() => {
        if (topics) {
            const slugs = topics.map((t) => t.slug);
            const index = slugs.indexOf(topic);

            if (index >= 0) {
                setTab(slugs.indexOf(topic));
            }
        }
    }, [topics]);

    // handle redirection for selected topic
    const handleChange = (event, newValue) => {
        setTab(newValue);
        const url =
            newValue !== "home-default" ? "/t/" + topics[newValue]?.slug : "/";
        navigate(url);
    };

    return (
        <AppBar position="static" color="default">
            <Tabs
                value={tab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="wrapped label tabs example"
                TabIndicatorProps={{
                    style: { transition: "none" },
                }}
            >
                <Tab value="home-default" label="Popular" />
                {topics.map((item, i) => (
                    <Tab value={i} label={item.title} key={i} />
                ))}
            </Tabs>
        </AppBar>
    );
};

export default React.memo(PhotoGalleryTopics);
