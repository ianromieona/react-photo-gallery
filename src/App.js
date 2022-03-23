import PhotoGalleryApp from "./components/PhotoGallery/PhotoGalleryApp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFoundApp from "./components/NotFound/NotFoundApp";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFoundApp />} />
                    <Route path="/" element={<PhotoGalleryApp />} />
                    <Route path="/q/:search" element={<PhotoGalleryApp />} />
                    <Route path="/t/:topic" element={<PhotoGalleryApp />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
