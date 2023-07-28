import { BASE_URL } from "../../Config/Api";
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType";

export const createChat = (chatData) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/chat/single`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${chatData.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(chatData.dataa),
		});

		const resData = await res.json();

		// if (resData.jwt) {
		// 	localStorage.setItem("token", resData.jwt);
		// }
		console.log("Chat Data ", resData);
		dispatch({ type: CREATE_CHAT, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const createGroupChat = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/chat/group`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${data.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data.group),
		});

		const resData = await res.json();

		// if (resData.jwt) {
		// 	localStorage.setItem("token", resData.jwt);
		// }
		console.log("Group Chat Data ", resData);
		dispatch({ type: CREATE_GROUP, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const getUserChat = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/chat/user`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${data.token}`,
				"Content-Type": "application/json",
			},
		});

		const resData = await res.json();

		// if (resData.jwt) {
		// 	localStorage.setItem("token", resData.jwt);
		// }
		console.log("Users chat", resData);
		dispatch({ type: GET_USERS_CHAT, payload: resData });
	} catch (error) {
		console.log(error);
	}
};
