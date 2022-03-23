import { render, screen, fireEvent } from "@testing-library/react";

// Component
import PhotoGallerySort from "../PhotoGallerySort";

// Test PhotoGallerySort Component
test("render sort button", () => {
    render(<PhotoGallerySort />);
    const linkElement = screen.getByText(/Sort By/i);
    expect(linkElement).toBeInTheDocument();
});

test("render sort option relevant", () => {
    const { getByText, getByTestId } = render(<PhotoGallerySort />);
    const linkElement = screen.getByText(/Sort By/i);
    fireEvent.click(linkElement);
    expect(getByTestId("relevant-btn")).toHaveTextContent("Relevance");
});

test("render sort option latest", () => {
    const { getByText, getByTestId } = render(<PhotoGallerySort />);
    const linkElement = screen.getByText(/Sort By/i);
    fireEvent.click(linkElement);
    expect(getByTestId("latest-btn")).toHaveTextContent("Newest");
});
