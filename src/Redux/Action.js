import { BASE_URL } from "../Config/Api";
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

export const register = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const resData = await res.json();
		if (resData.jwt) {
			localStorage.setItem("token", resData.jwt);
		}
		console.log("Register ", resData);
		dispatch({ type: REGISTER, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const login = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/auth/signin`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const resData = await res.json();
		if (resData.jwt) {
			localStorage.setItem("token", resData.jwt);
		}
		console.log("Login ", resData);
		dispatch({ type: LOGIN, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const currentUser = (token) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/users/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const resData = await res.json();
		console.log("currUser ", resData);
		dispatch({ type: REQ_USER, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const searchUser = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/users/search?name=${data.keyword}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${data.token}`,
			},
		});

		const resData = await res.json();
		console.log("searchUser ", resData);
		dispatch({ type: SEARCH_USER, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const updateUser = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/users/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${data.token}`,
			},
			body: JSON.stringify(data.data),
		});

		const resData = await res.json();
		console.log("Update User ", resData);
		dispatch({ type: UPDATE_USER, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const logout = () => async (dispatch) => {
	localStorage.removeItem("token");
	dispatch({ type: LOGOUT, payload: null });
	dispatch({ type: REQ_USER, payload: null });
};
