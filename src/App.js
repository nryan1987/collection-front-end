//import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
//import store from "./store/Store";
//import LoginForm from "./components/LoginForm";
//import Navigation from "./components/Navigation";
import Main from "./components/Main";

function App() {
	return (
		<div className="App">
			<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
			{/* <LoginForm store={store} /> */}
			{/* <Navigation /> */}
			<Main />
		</div>
	);
}

export default App;
