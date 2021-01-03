import React from "react";
import { render } from "react-dom";
import App from "@components/App";
import "./styles/index.scss";

// Регистрируем service-worker
window.addEventListener("load", () => {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("./service-worker.js")
			// .then(registration => {
			// 	console.log("Service worker successfully registered", registration);
			// })
			.catch(error => {
				console.log("Service worker registration failed", error);
			});
	}
});

render(<App />, document.querySelector("#root"));
