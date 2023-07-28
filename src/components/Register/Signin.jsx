import { Alert, Button, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, login } from "../../Redux/Action";

const Signin = () => {
	const [inputData, setInputData] = useState({
		email: "",
		password: "",
	});

	const dispatch = useDispatch();
	const { auth } = useSelector((store) => store);
	const token = localStorage.getItem("token");

	const [openSnakebar, setOpenSnakebar] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login(inputData));
		setOpenSnakebar(true);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputData((data) => ({
			...data,
			[name]: value,
		}));
	};

	const handleSnakebarClose = () => {
		setOpenSnakebar(false);
	};

	useEffect(() => {
		if (token) {
			dispatch(currentUser(token));
		}
	}, [token]);

	useEffect(() => {
		if (auth.reqUser?.email) {
			navigate("/");
		}
	}, [auth.reqUser]);

	return (
		<div>
			<div className="flex justify-center items-center h-screen">
				<div className="w-[30%] p-10 shadow-md bg-white">
					<form onSubmit={handleSubmit} className="sapce-y-5">
						<div>
							<p className="m-2">Email</p>
							<input
								onChange={handleChange}
								placeholder="Enter your email"
								type="text"
								name="email"
								value={inputData.email}
								className="py-2 outline outline-green-600 w-full rounded-md border "
							/>
						</div>

						<div>
							<p className="m-2">Password</p>
							<input
								onChange={handleChange}
								placeholder="Enter your password"
								type="password"
								name="password"
								value={inputData.password}
								className="py-2 outline outline-green-600 w-full rounded-md border "
							/>
						</div>

						<div className="mt-5">
							<Button className="w-full" variant="contained" color="success" type="submit">
								Login
							</Button>
						</div>
					</form>
					<div className="flex space-x- justify-center items-center mt-5">
						<p className="m-3">Create New Account</p>
						<Button variant="contained" onClick={() => navigate("/signup")}>
							SignUp
						</Button>
					</div>
				</div>
			</div>

			<Snackbar open={openSnakebar} autoHideDuration={6000} onClose={handleSnakebarClose}>
				<Alert onClose={handleSnakebarClose} severity="success" sx={{ width: "100%" }}>
					This is a success message!
				</Alert>
			</Snackbar>
		</div>
	);
};

export default Signin;
