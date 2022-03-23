import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Component
import PhotoGalleryApp from "../PhotoGalleryApp";

// Redux
import { Provider } from "react-redux";
import store from "../../../store";

// Test PhotoGalleryApp Component
test("render photos", async () => {
    const { queryByText } = render(
        <Provider store={store}>
            <BrowserRouter>
                <PhotoGalleryApp />
            </BrowserRouter>
        </Provider>
    );
    expect(screen.getByText("Fetching cool photos...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
        queryByText("Fetching cool photos...")
    );
});
