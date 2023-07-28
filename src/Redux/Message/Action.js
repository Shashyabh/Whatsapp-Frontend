import { BASE_URL } from "../../Config/Api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";

export const createMessage = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/messages/create`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${data.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data.dataa),
		});

		const resData = await res.json();

		// if (resData.jwt) {
		// 	localStorage.setItem("token", resData.jwt);
		// }
		console.log("Create Message ", resData);
		dispatch({ type: CREATE_NEW_MESSAGE, payload: resData });
	} catch (error) {
		console.log(error);
	}
};

export const getAllMessages = (data) => async (dispatch) => {
	try {
		const res = await fetch(`${BASE_URL}/api/messages/chat/${data.chatId}`, {
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
		console.log("Get All Messages ", resData);
		dispatch({ type: GET_ALL_MESSAGE, payload: resData });
	} catch (error) {
		console.log(error);
	}
};
