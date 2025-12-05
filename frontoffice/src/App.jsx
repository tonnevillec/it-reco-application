import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import {ToastContainer} from "react-toastify";
import Store from "./pages/store/store.jsx";
import StoreDetails from "./pages/store/storeDetails.jsx";

function App() {

  return (
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}>
        <Routes>
            <Route path={"/"} element={<Home />}>
                <Route path={"/store"} element={<Store />}>
                    <Route path={"/store/:id"} element={<StoreDetails />}></Route>
                    <Route path={"/store"} element={<Store />}></Route>
                </Route>
            </Route>
        </Routes>

        <ToastContainer />
    </BrowserRouter>
  )
}

export default App
