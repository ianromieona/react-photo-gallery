import { render, screen } from "@testing-library/react";

// Redux
import { Provider } from "react-redux";
import store from "./store";

// Component
import App from "./App";

test("renders app wrapper", () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    );
    const linkElement = screen.getByText(/Popular/i);
    expect(linkElement).toBeInTheDocument();
});
