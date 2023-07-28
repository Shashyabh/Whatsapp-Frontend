import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, register } from "../../Redux/Action";
import { store } from "../../Redux/Store";

const Signup = () => {
	const [inputData, setInputData] = useState({
		full_name: "",
		email: "",
		password: "",
	});

	const [openSnakebar, setOpenSnakebar] = useState(false);
	const { auth } = useSelector((store) => store);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const token = localStorage.getItem("token");

	useEffect(() => {
		if (token) {
			dispatch(currentUser(token));
		}
	}, [token]);

	useEffect(() => {
		if (auth.reqUser?.full_name) {
			navigate("/");
		}
	}, [auth.reqUser]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(register(inputData));
		if (inputData.error === null) {
			setOpenSnakebar(true);
		}
		console.log(inputData);
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
	return (
		<div>
			<div className="flex justify-center items-center h-screen">
				<div className="w-[30%] p-10 shadow-md bg-white">
					<form onSubmit={handleSubmit} className="sapce-y-5">
						<div>
							<p className="mb-2">Name</p>
							<input
								placeholder="Enter your name"
								type="text"
								name="full_name"
								onChange={(e) => handleChange(e)}
								value={inputData.full_name}
								className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1 "
							/>
						</div>
						<div>
							<p className="mb-2">Email</p>
							<input
								onChange={(e) => handleChange(e)}
								placeholder="Enter your email"
								type="text"
								name="email"
								value={inputData.email}
								className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1 "
							/>
						</div>

						<div>
							<p className="mb-2">Password</p>
							<input
								onChange={(e) => handleChange(e)}
								placeholder="Enter your password"
								type="password"
								name="password"
								value={inputData.password}
								className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1 "
							/>
						</div>

						<div className="mt-5">
							<Button className="w-full" variant="contained" color="success" type="submit">
								Register
							</Button>
						</div>
					</form>
					<div className="flex space-x- justify-center items-center mt-5">
						<p className="m-3">Already Have Account</p>
						<Button variant="contained" onClick={() => navigate("/signin")}>
							Login
						</Button>
					</div>
				</div>
			</div>

			<Snackbar open={openSnakebar} autoHideDuration={6000} onClose={handleSnakebarClose}>
				<Alert onClose={handleSnakebarClose} severity="success" sx={{ width: "100%" }}>
					Your Account has been created successfully !
				</Alert>
			</Snackbar>
		</div>
	);
};

export default Signup;
