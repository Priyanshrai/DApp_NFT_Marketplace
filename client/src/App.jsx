import { EthProvider } from "./contexts/EthContext";

import MarketPlace from "./components/Marketplace";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
        
          <MarketPlace />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
