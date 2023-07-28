import React, { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/Action";

const Profile = ({ handleCloseProfile }) => {
	//Setting the state for editing name
	const [flag, setFlag] = useState(false);

	const [username, setUsername] = useState(null);

	const [tempPicture, setTempPicture] = useState();

	const { auth } = useSelector((store) => store);

	const dispatch = useDispatch();

	const handleFlag = () => {
		setFlag(true);
	};

	const handleCheckClick = () => {
		setFlag(false);
		const data = {
			token: localStorage.getItem("token"),
			data: {
				full_name: username,
				profile_picture: auth.reqUser.profile_picture,
			},
		};

		dispatch(updateUser(data));
	};

	const handleChange = (e) => {
		setUsername(e.target.value);
	};

	const uploadToCloudinary = (pics) => {
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
				setTempPicture(data.url.toString());
				const dataa = {
					// id: auth.reqUser.id,
					token: localStorage.getItem("token"),
					data: {
						profile_picture: data.url.toString(),
						full_name: auth.reqUser?.full_name,
					},
				};
				dispatch(updateUser(dataa));
			});
	};

	return (
		<div className="w-full h-full">
			<div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
				<BsArrowLeft
					className="cursor-pointer text-2xl font-bold"
					onClick={handleCloseProfile}
				/>
				<p className="cursor-pointer font-semibold">Profile</p>
			</div>

			{/* Profile pic section */}
			<div className="flex flex-col jusify-center items-center my-12">
				<label htmlFor="imgInput">
					<img
						className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
						src={
							auth.reqUser?.profile_picture ||
							"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
						}
						alt=""
					/>
				</label>

				<input
					onChange={(e) => uploadToCloudinary(e.target.files[0])}
					type="file"
					id="imgInput"
					className="hidden"
				/>
			</div>

			{/* Name section */}

			<div className="bg-white px-3">
				<p className="py-3">{auth.reqUser.full_name ? auth.reqUser.full_name : "No One"}</p>
				{!flag && (
					<div className="w-full flex justify-between items-center">
						<p className="py-3">{username || "Username"}</p>
						<BsPencil onClick={handleFlag} className="cursor-pointer" />
					</div>
				)}

				{flag && (
					<div className="w-full flex justify-between items-center py-2">
						<input
							className="w-[80%] outline-none border-b-2 border-blue-700 p-2"
							type="text"
							placeholder="Enter your name"
							onChange={handleChange}
						/>
						<BsCheck2 onClick={handleCheckClick} className="cursor-pointer text-2xl" />
					</div>
				)}
			</div>

			<div className="px-3 my-5">
				<p className="py-10">
					This is not your username, this name will be visible to your WhatsApp contacts
				</p>
			</div>
		</div>
	);
};

export default Profile;
