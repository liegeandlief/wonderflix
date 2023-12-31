import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="bg-black min-h-screen text-white px-10 py-5 grid content-start gap-10">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to={"/home"} />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
