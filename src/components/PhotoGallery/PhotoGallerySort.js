import React, { useState } from "react";

// UI
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const PhotoGallerySort = ({ handleSort, sort }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickSort = (type) => {
        handleSort(type);
        handleClose();
    };

    return (
        <div className="right">
            <Button
                id="menu-dropdown"
                aria-controls={open ? "menu-dd" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{ textTransform: "unset !important" }}
            >
                Sort by: {sort === "latest" ? "Latest" : "Relevance"}
            </Button>
            <Menu
                id="menu-dd"
                aria-labelledby="menu-dd-btn"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem onClick={() => handleClickSort("relevant")}>
                    Relevance
                </MenuItem>
                <MenuItem onClick={() => handleClickSort("latest")}>
                    Newest
                </MenuItem>
            </Menu>
        </div>
    );
};

export default React.memo(PhotoGallerySort);
