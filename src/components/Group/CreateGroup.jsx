import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Action";

const CreateGroup = ({ handleCloseGroup, setIsGroup }) => {
	const [newGroup, setNewGroup] = useState(false);
	const [groupMember, setGroupMember] = useState(new Set());
	const [query, setQuery] = useState("");
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");

	const { auth } = useSelector((store) => store);

	// const handleRemoveMember = (item) => {
	// 	groupMember.delete(item);
	// 	setGroupMember(groupMember);
	// 	// console.log("clicked");
	// };

	const handleRemoveMember = (item) => {
		const updatedMembers = new Set(Array.from(groupMember).filter((member) => member !== item));
		setGroupMember(updatedMembers);
	};

	const handleBackButton = () => {
		setNewGroup(false);
	};

	const handleSearch = (keyword) => {
		dispatch(searchUser({ keyword, token }));
	};

	return (
		<div className="w-full h-full">
			{!newGroup && (
				<div>
					<div className="flex items-center space-x-10 bg-[#008069] text-white pt-10 px-10 pb-5">
						<BsArrowLeft
							onClick={handleCloseGroup}
							className="cursor-pointer text-2xl font-bold "
						/>
						<p className="text-xl font-semibold">Add Group Participents</p>
					</div>

					<div className="relative bg-white py-4 px-3">
						<div className="flex space-x-2 flex-wrap space-y-1 ">
							{groupMember.size > 0 &&
								Array.from(groupMember).map((item) => (
									<SelectedMember
										handleRemoveMember={() => handleRemoveMember(item)}
										member={item}
									/>
								))}
						</div>

						<input
							className="outline-none border-b border-[#8888] p-2 w-[93%]"
							placeholder="Search User"
							type="text"
							value={query}
							onChange={(e) => {
								handleSearch(e.target.value);
								setQuery(e.target.value);
							}}
						/>
					</div>

					<div className="bg-white overflow-y-scroll h-[50.2vh] ">
						{query &&
							auth.searchUser.map((item) => (
								<div
									onClick={() => {
										groupMember.add(item);
										setGroupMember(groupMember);
										setQuery("");
									}}
									key={item?.id}
								>
									<hr />
									<ChatCard userImg={item.profile_picture} name={item.full_name} />
								</div>
							))}
					</div>

					<div className="bottom-10 py-10 bg-slate-200 flex items-center justify-center">
						<div
							className="bg-green-600 rounded-full p-4 cursor-pointer"
							onClick={() => {
								setNewGroup(true);
							}}
						>
							<BsArrowRight className="text-white font-bold text-3xl" />
						</div>
					</div>
				</div>
			)}

			{newGroup && (
				<NewGroup
					handleBackButton={handleBackButton}
					groupMember={groupMember}
					setIsGroup={setIsGroup}
				/>
			)}
		</div>
	);
};

export default CreateGroup;
