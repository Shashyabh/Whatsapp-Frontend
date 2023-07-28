import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter, BsMicFill } from "react-icons/bs";
import { BsThreeDotsVertical, BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logout, searchUser } from "../Redux/Action";
import { createChat, getUserChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";

import SockJS from "sockjs-client";
import { over } from "stompjs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const HomePage = () => {
	//emoji
	const [showEmoji, setShowEmoji] = useState(false);

	//Reat time chat
	const [stompClient, setStompClient] = useState();
	const [isConnect, setIsConnected] = useState(false);
	const [messages, setMessages] = useState([]);

	//search
	const [query, setQuery] = useState(null);

	//All chat
	const [currentChat, setCurrentChat] = useState(null);

	//Message
	const [content, setContent] = useState(null);

	//Profile
	const [isProfile, setIsProfile] = useState(false);

	//Navigate to page
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { auth, chat, message } = useSelector((store) => store);
	const token = localStorage.getItem("token");

	//Handler for User Group create
	const [isGroup, setIsGroup] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCreateGroup = () => {
		setIsGroup(true);
	};

	// Search handler
	const handleSearch = (keyword) => {
		dispatch(searchUser({ keyword, token }));
	};

	//To handle chart background
	const handleClickOnChatCard = (userId) => {
		//setCurrentChat(true);
		console.log(userId);
		dispatch(createChat({ token, dataa: { userId } }));
		setQuery("");
	};

	//To add emoji

	const addEmoji = (e) => {
		const sym = e.unified.split("_");
		const codeArray = [];
		sym.forEach((el) => codeArray.push("0x" + el));
		let emoji = String.fromCodePoint(...codeArray);
		// console.log(emoji);
		setContent(content + emoji);
		console.log(content);
	};

	//To send message

	const handleCreateNewMessage = () => {
		dispatch(createMessage({ token, dataa: { chatId: currentChat.id, content: content } }));
		// setContent("");
	};

	//To create chat

	useEffect(() => {
		dispatch(getUserChat({ token }));
	}, [chat.createdChat, chat.createdGroup]);

	//Get all messages
	useEffect(() => {
		if (currentChat?.id) {
			dispatch(getAllMessages({ chatId: currentChat.id, token }));
		}
	}, [currentChat, message.newMessage]);

	//To naviage

	const handleNavigate = () => {
		setIsProfile(true);
	};

	//Handle Props passed to Profile for closing the profile

	const handleCloseProfile = () => {
		setIsProfile(false);
	};

	//Group close button arrow
	const handleCloseGroup = () => {
		setIsGroup(false);
	};

	//Token give
	useEffect(() => {
		dispatch(currentUser(token));
	}, [token]);

	//logout

	const handleLogout = () => {
		dispatch(logout());
		navigate("/signup");
	};

	useEffect(() => {
		if (!auth.reqUser) {
			navigate("/signup");
		}
	}, [auth.reqUser]);

	// To handle current chat
	const handleCurrentChat = (item) => {
		setCurrentChat(item);
	};

	//Code for getting realtime chat

	const getCookie = (name) => {
		const value = `;${document.cookie}`;
		const parts = value.split(`;${name}=`);

		if (parts.length === 2) {
			return parts.pop().split(";").shift();
		}
	};

	const onError = (error) => {
		console.log("On error", error);
	};

	const onConnect = () => {
		setIsConnected(true);
	};

	useEffect(() => {
		if (message.name && stompClient) {
			setMessages([...messages, message.newMessage]);
			stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
		}
	}, [message.newMessage]);

	useEffect(() => {
		setMessages(message.messages);
	}, [message.messages]);

	const onMessageReceive = (payload) => {
		console.log("Received Message", JSON.parse(payload.body));
		const receiveMessage = JSON.parse(payload.body);
		setMessages([...messages, receiveMessage]);
	};

	useEffect(() => {
		if (isConnect && stompClient && auth.reqUser && currentChat) {
			const subscription = stompClient.subscribe(
				"/group/" + currentChat.id.toString(),
				onMessageReceive
			);
			return () => {
				subscription.unsubscribe();
			};
		}
	}, []);

	useEffect(() => {
		connect();
	}, []);

	const connect = () => {
		const sock = new SockJS("http://localhost:2525/websocket");
		const temp = over(sock);

		setStompClient(temp);
		const headers = {
			Authorization: `Bearer ${token}`,
			"X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
		};

		temp.connect(headers, onConnect, onError);
	};

	return (
		<div className="relative">
			<div className="py-14 bg-[#00a884] w-full "></div>
			<div className="flex bg-[#f0f2f5] h-[90vh] w-[96vw] left-[2vw] absolute top-[5vh]">
				{/* Left segment */}

				<div className="left w-[30%] bg-[#e8e9ec] h-full">
					{/* Group..... Page */}
					{isGroup && (
						<CreateGroup handleCloseGroup={handleCloseGroup} setIsGroup={setIsGroup} />
					)}

					{/* Profile..... Page */}
					{isProfile && (
						<div className="w-full h-full">
							<Profile handleCloseProfile={handleCloseProfile} />
						</div>
					)}

					<div className="w-full">
						{/*Home Page..... Top part with image */}
						{!isProfile && !isGroup && (
							<div className="flex justify-between items-center p-3">
								<div onClick={handleNavigate} className="flex items-center space-x-3">
									<img
										className="rounded-full w-10 h-10 cursor-pointer"
										src={
											auth.reqUser?.profile_picture
												? auth.reqUser?.profile_picture
												: "https://cdn.pixabay.com/photo/2023/05/20/16/54/rose-8006847_1280.jpg"
										}
										alt=""
									/>
									<p>{auth.reqUser?.full_name}</p>
								</div>
								<div className="space-x-3 text-2xl flex">
									<TbCircleDashed
										className="cursor-pointer"
										onClick={() => navigate("/status")}
									/>
									<BiCommentDetail />
									<div>
										<BsThreeDotsVertical
											className="cursor-pointer"
											id="basic-button"
											aria-controls={open ? "basic-menu" : undefined}
											aria-haspopup="true"
											aria-expanded={open ? "true" : undefined}
											onClick={handleClick}
										/>
										<Menu
											id="basic-menu"
											anchorEl={anchorEl}
											open={open}
											onClose={handleClose}
											MenuListProps={{
												"aria-labelledby": "basic-button",
											}}
										>
											<MenuItem onClick={handleClose}>Profile</MenuItem>
											<MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
											<MenuItem onClick={handleClose}>My Account</MenuItem>
											<MenuItem onClick={handleLogout}>Logout</MenuItem>
										</Menu>
									</div>
								</div>
							</div>
						)}

						{/* Search bar */}
						<div className="relative flex justify-center items-center bg-white py-4 px-3">
							<input
								className="border-none outline-none  bg-slate-200 rounded-md w-[93%] pl-9 py-2"
								type="text"
								placeholder="Search or Start new Chat"
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									handleSearch(e.target.value);
								}}
							/>
							<AiOutlineSearch className="left-5 top-7 absolute" />
							<div>
								<BsFilter className="ml-4 text-3xl" />
							</div>
						</div>

						{/* Chat Card */}
						<div className="bg-white overflow-y-scroll h-[72vh] px-3">
							{query &&
								auth.searchUser?.map((item) => (
									<div onClick={() => handleClickOnChatCard(item.id)}>
										{" "}
										<hr />
										<ChatCard
											name={item && item?.full_name ? item?.full_name : "N/A"}
											userImg={
												(item.profile_picture && item.profile_picture) ||
												"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
											}
										/>
									</div>
								))}

							{chat.chats.length > 0 &&
								!query &&
								chat.chats?.map((item) => (
									<div onClick={() => handleCurrentChat(item)}>
										{" "}
										<hr />
										{item.group ? (
											<ChatCard
												name={item.chat_name}
												userImg={
													item.chat_image ||
													"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
												}
											/>
										) : (
											<ChatCard
												isChat={true}
												name={
													auth.reqUser.id !== item.users[0]?.id
														? item.users[0]?.full_name
														: item.users[1]?.full_name
												}
												userImg={
													auth.reqUser?.id !== item.users[0]?.id
														? item.users[0]?.profile_picture ||
														  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
														: item.users[1]?.profile_picture ||
														  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
												}
											/>
										)}
									</div>
								))}
						</div>
					</div>
				</div>

				{/* Right segment */}
				{/* Default page */}

				{!currentChat && (
					<div className="w-[70%] flex flex-col items-center justify-center h-full">
						<div className="max-w-[70%] text-center">
							<img
								src="https://res.cloudinary.com/zarmariya/image/upload/v1662264838/whatsapp_multi_device_support_update_image_1636207150180-removebg-preview_jgyy3t.png"
								alt=""
							/>
							<h1 className="text-4xl text-grey-600">WhatsApp Web</h1>
							<p className="my-9">
								Send and receive message without keeping your phone online. Use Whatsapp on
								Up to 4 Linked devices and 1 phone at the same time{" "}
							</p>
						</div>
					</div>
				)}

				{/* Message Chat page */}
				{currentChat && (
					<div className="w-[70%] relative">
						<div className="header absolute top-0 w-full bg-[#f0f2f5]">
							<div className="flex justify-between">
								<div className="py-3 px-3 space-x-4 flex items-center">
									<img
										className="w-10 h-10 rounded-full"
										src={
											currentChat.isGroup
												? currentChat.chat_image
												: auth.reqUser?.id !== currentChat.users[0]?.id
												? currentChat.users[0]?.profile_picture ||
												  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
												: currentChat.users[1]?.profile_picture ||
												  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
										}
										alt=""
									/>
									<p>
										{currentChat.isGroup
											? currentChat.chat_name
											: auth.reqUser?.id === currentChat.users[0]?.id
											? currentChat.users[1]?.full_name
											: currentChat.users[0]?.full_name}
									</p>
								</div>
								<div className="py-3 space-x-4 flex items-center px-3">
									<AiOutlineSearch />
									<BsThreeDotsVertical />
								</div>
							</div>
						</div>

						{/* Message Section */}
						<div className="px-10 h-[85vh] overflow-y-scroll bg-blue-200">
							<div className="space-y-1 flex flex-col justify-content mt-20 py-2">
								{message.messages?.length > 0 &&
									message.messages?.map((item, i) => (
										<MessageCard
											isReqUserMessage={item.user.id !== auth.reqUser.id}
											content={item.content}
										/>
									))}
							</div>
						</div>

						{/* Footer Message Part */}

						<div className="footer bg-[#f0f2f5]  absolute bottom-0 w-full py-3 text-2xl">
							<div className="flex justify-between items-center px-5 relative">
								<BsEmojiSmile
									onClick={() => setShowEmoji(!showEmoji)}
									className="cursor-pointer"
								/>
								{showEmoji && (
									<div className="absolute bottom-20 right-20">
										<Picker data={data} onEmojiSelect={addEmoji} />
									</div>
								)}
								<ImAttachment />

								<input
									className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
									type="text"
									onChange={(e) => setContent(e.target.value)}
									placeholder="Type message"
									value={content}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleCreateNewMessage();
											setContent("");
										}
									}}
								/>
								<BsMicFill />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
