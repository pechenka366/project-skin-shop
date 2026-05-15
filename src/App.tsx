import "./App.css";
import About from "./components/About";
import Header from "./components/Header";
import Main from "./components/Main";
import Catalog from "./components/Catalog";
import MaterialsBlock from "./components/materialsBlock";
import "./style/resert.css";

function App() {
  return (
    <>
      <Header />
      <Main />
      <About />
      <Catalog />
      <MaterialsBlock />
    </>
  );
}

export default App;
