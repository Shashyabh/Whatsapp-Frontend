import React from "react";
import { useNavigate } from "react-router-dom";

const StatusUserCard = ({ userId }) => {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(`/status/${userId}`);
	};

	return (
		<div onClick={handleNavigate} className="flex items-center p-3 cursor-pointer">
			<div>
				<img
					className="h-7 w-7 lg:w-10 lg:h-10 rounded-full"
					src="https://cdn.pixabay.com/photo/2016/11/29/11/13/animal-1869120_640.jpg"
					alt=""
				/>
			</div>
			<div className="ml-2 text-white">
				<p>Shashyabh Ray</p>
			</div>
		</div>
	);
};

export default StatusUserCard;
