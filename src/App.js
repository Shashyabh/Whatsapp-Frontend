import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Status from "./components/Status/Status";
import StatusView from "./components/Status/StatusView";
import Signin from "./components/Register/Signin";
import Signup from "./components/Register/Signup";
function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/status" element={<Status />} />
				<Route path="/status/:userId" element={<StatusView />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</div>
	);
}

export default App;
