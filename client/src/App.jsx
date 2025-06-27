import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./component/Header";
import Footer from "./component/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
