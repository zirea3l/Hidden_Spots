import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlaceDetails from "./pages/PlaceDetails";
import Login from "./pages/Login";
import CreatePlace from "./pages/CreatePlace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePlace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;