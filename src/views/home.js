import React, { useState, useRef } from "react";
import "../styles.css";
import Cookie from "js-cookie"
import { useHistory } from "react-router-dom";


export default function Home({ setAvatarUrl, ...props }) {

	const history = useHistory()

	const [user, setUser] = useState("")
	const [room, setRoom] = useState("General")
	const select = useRef(null)


	const handleChatEntrance = (e) => {
		e.preventDefault()

		if (user && room) {
			const roomExists = rooms.find(child => child === room)
			if (roomExists) {

				Cookie.set("user", JSON.stringify(user))
				history.push(`/${room}`)

			}
			else {
				console.log("room doesnt exist")
			}
		}
	}

	const handleFile = (e) => {
		const formData = new FormData();
		console.log(e.target.files[0])
		formData.append('file', e.target.files[0]);
		// replace this with your upload preset name
		formData.append('upload_preset', 'ml_default');
		const options = {
			method: 'POST',
			body: formData,
		};

		// replace cloudname with your Cloudinary cloud_name
		return fetch('https://api.Cloudinary.com/v1_1/dt64i9m5y/image/upload', options)
			.then(res => res.json())
			.then(({ secure_url }) => {
				console.log(secure_url)
				setAvatarUrl(secure_url)
			})
			.catch(err => console.log(err));
	}


	const rooms = ["General", "Travel", "Work", "Love", "Misc"]

	return (
		<div className="join-container">
			<header className="join-header">
				<h1><i className="fas fa-smile"></i> Chatta</h1>
			</header>
			<main className="join-main">
				<form id="enter-form" onSubmit={handleChatEntrance}
				>
					<div className="form-control">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							name="username"
							id="username"
							placeholder="Enter username..."
							required
							value={user}
							onChange={(e) => {
								setUser(e.target.value)
							}}

						/>
					</div>
					<div className="form-control">
						<label htmlFor="avatar" id="avatar" />
						<input name="avatar" type="file" onChange={handleFile} />
					</div>
					<div className="form-control">
						<label htmlFor="room">Room</label>
						<select value={room || "Javascript"}
							ref={select}
							onChange={(e) => { setRoom(e.target.value) }}
							name="room" id="room">
							{rooms.map(roomm => <option value={roomm} selected>{roomm}</option>)}
						</select>
					</div>
					<button type="submit" className="btn">Join Chat</button>
				</form>
			</main>
		</div>
	);
}
