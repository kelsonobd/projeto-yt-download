import Footer from "./pages/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] flex flex-col pt-8">
      <Home />
      <Footer />
    </div>
  );
}

export default App;