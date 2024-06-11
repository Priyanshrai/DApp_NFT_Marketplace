import { EthProvider } from "./contexts/EthContext";
import Marketplace from "./components/Marketplace";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Marketplace />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
