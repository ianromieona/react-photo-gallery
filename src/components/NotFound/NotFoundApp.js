import React from "react";
import { useNavigate } from "react-router-dom";

// UI
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NotFoundApp = () => {
    const navigate = useNavigate();

    return (
        <Typography
            variant="h5"
            gutterBottom
            component="div"
            align="center"
            className="not-found"
        >
            404 Page not found
            <br />
            <Button id="menu-dropdown" onClick={() => navigate("/")}>
                Go Back to Home
            </Button>
        </Typography>
    );
};

export default React.memo(NotFoundApp);
