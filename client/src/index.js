import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import ScrollToTop from "./scrollToTop";
import App from "./App";

window.onload = function () {
  if (localStorage.getItem("theme")) {
    document.getElementById("body").className = localStorage.getItem("theme") || "default";
  }
};
window.addEventListener("online", () => {
  let offlineBanner = document.querySelector("#offline-alert");
  offlineBanner.classList.add("hiddenCustom");
  offlineBanner.innerText = "";
});
window.addEventListener("offline", () => {
  let offlineBanner = document.querySelector("#offline-alert");
  offlineBanner.classList.remove("hiddenCustom");
  offlineBanner.innerText = "You are currently offline! 🚨";
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ScrollToTop />
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
