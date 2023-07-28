import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ handleBackButton, groupMember, setIsGroup }) => {
	const [isImageUploading, setIsImageUploading] = useState(false);

	const [groupName, setGroupName] = useState();

	const dispatch = useDispatch();

	const [groupImage, setGroupImage] = useState(null);

	const token = localStorage.getItem("token");

	const handleCreateGroup = () => {
		let userIds = [];
		for (let user of groupMember) {
			userIds.push(user.id);
		}

		const group = {
			userIds,
			chat_name: groupName,
			chat_image: groupImage,
		};

		const data = {
			group,
			token,
		};

		dispatch(createGroupChat(data));
		setIsGroup(false);
	};

	const uploadToCloudinary = (pics) => {
		setIsImageUploading(true);
		const data = new FormData();
		data.append("file", pics);
		data.append("upload_preset", "cakrors2");
		data.append("cloud_name", "dtvjh9v05");
		fetch("https://api.cloudinary.com/v1_1/dtvjh9v05/image/upload", {
			method: "POST",
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				setGroupImage(data.url.toString());
				setIsImageUploading(false);
			});
	};

	return (
		<div className="w-full h-full">
			<div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
				<BsArrowLeft onClick={handleBackButton} className="cursor-pointer text-2xl font-bold" />
				<p className="text-xl font-semibold">New Group</p>
			</div>

			<div className="flex flex-col justify-center items-center my-12">
				<label htmlFor="imgInput" className="relative">
					<img
						className="w-40 h-40 rounded-full"
						src={
							groupImage ||
							"https://images.pexels.com/photos/2422290/pexels-photo-2422290.jpeg?auto=compress&cs=tinysrgb&w=600"
						}
						alt=""
					/>

					{isImageUploading && (
						<CircularProgress className="absolute top-[5rem] left-[6rem]" />
					)}
				</label>

				<input
					type="file"
					id="imgInput"
					className="hidden"
					onChange={(e) => uploadToCloudinary(e.target.files[0])}
				/>
			</div>
			<div className="w-full flex justify-between items-center py-2 px-5">
				<input
					className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
					placeholder="Group Subject"
					type="text"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
				/>
			</div>

			{groupName && (
				<div className="flex items-center justify-center py-10 bg-slate-200">
					<Button onClick={handleCreateGroup}>
						<div className="bg-[#0c977d] rounded-full  p-4">
							<BsCheck2 className="text-white font-bold text-3xl" />
						</div>
					</Button>
				</div>
			)}
		</div>
	);
};

export default NewGroup;
