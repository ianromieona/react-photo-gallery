import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Component
import PhotoGalleryTopics from "../PhotoGalleryTopics";

// Redux
import { Provider } from "react-redux";
import store from "../../../store";

// Test PhotoGalleryTopics Component
test("render popular category", () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <PhotoGalleryTopics />
            </BrowserRouter>
        </Provider>
    );
    const element = screen.getByText(/Popular/i);
    expect(element).toBeInTheDocument();
});

// Test if topics has loaded
test("renders topics", async () => {
    const { getByText } = render(
        <Provider store={store}>
            <BrowserRouter>
                <PhotoGalleryTopics />
            </BrowserRouter>
        </Provider>
    );

    await waitFor(() => {
        expect(getByText("Act For Nature")).toBeInTheDocument();
    });
});
