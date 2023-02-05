const express = require("express")
const mongo = require("./mongo")
const { MessagingResponse } = require("twilio").twiml
const cron = require("node-cron")
const accountSid = "ACe4bb4376570dc30ff0b45137f43e21fd"
const authToken = "eb798adbb04cfd19be48ccca2cbcc18f"
const twilio = require("twilio")(accountSid, authToken)
const { dbscan } = require("outliers2d")

const app = express()

// API for twilio to notify a message being sent
app.get("/sms", async (req, res) => {
	const searchParams = new URLSearchParams(req.url.substring(req.url.indexOf("?")))

	console.log(searchParams.get("Body"))

	let users = await mongo.findAllUsers()
	users = users.filter((a) => {
		return a.auth == searchParams.get("Body")
	})

	const twiml = new MessagingResponse()

	if (users.length > 0) {
		users = users.sort((a, b) => {
			b.last_updated - a.last_updated
		})

		new_user = users[0]
		new_user.phone = searchParams.get("From")

		mongo.findUserAndReplace(users[0].userID, users[0])

		twiml.message("Pairing Successful")
	} else {
		twiml.message("Paring unsuccessful?!")
	}

	res.type("text/xml").send(twiml.toString())
})

// API method to create a new group
app.get("/api/creategroup", (req, res) => {
	const searchParams = new URLSearchParams(req.url.substring(req.url.indexOf("?")))

	let authCode = searchParams.get("auth")
	mongo.createGroup({
		groupID: authCode,
		userIDs: []
	})

	return
})

// API method to create a new user
app.get("/api/createuser", (req, res) => {
	const searchParams = new URLSearchParams(req.url.substring(req.url.indexOf("?")))

	let authCode = searchParams.get("auth")
	let groupAuthCode = searchParams.get("groupAuth")
	mongo.createUser({
		userID: authCode,
		groupID: groupAuthCode,
		latitude: null,
		longitude: null,
		phone: null,
		last_updated: Date.now()
	})

	return
})

// API method to verify a group auth code
app.get("/api/checkgroupauth", async (req, res) => {
	const searchParams = new URLSearchParams(req.url.substring(req.url.indexOf("?")))

	let authCode = searchParams.get("auth")
	let group = await mongo.findGroup()
	if (group == null) res.type("text/xml").send("false")
	res.type("text/xml").send("true")

	return
})

// API method to update a user's location
app.get("/api/updateloc", async (req, res) => {
	const searchParams = new URLSearchParams(req.url.substring(req.url.indexOf("?")))

	let lat = searchParams.get("lat")
	let long = searchParams.get("long")
	let auth = searchParams.get("auth")

	new_user = await mongo.findUser(auth)
	if (new_user == null) return

	new_user.latitude = lat
	new_user.longitude = long
	new_user.last_updated = Date.now()
	mongo.findUserAndReplace({ userID: auth, new_user })
})

app.listen(3000, () => {
	console.log("Express server listening on port 3000")
})

// Scheduled task to look at API updates and send a message to users if something is wrong
cron.schedule("*/10 * * * * *", async () => {
	await mongo.updateCache()

	let groups = await mongo.findAllGroups()
	let users = await mongo.findAllUsers()

	for (let i = 0; i < groups.length; i++) {
		let group = groups[i]
		let coordinates = []

		for (let j = 0; j < group.userIDs.length; j++) {
			let user = await mongo.findUser(group.userIDs[j])
			coordinates.push([user.latitude, user.longitude])
		}

		const res = dbscan(coordinates)

		if (res.outliers.length == 0) continue
		for (let j = 0; j < res.outliers; j++) {
			let userLost = await mongo.findUser(
				group.userIDs[coordinates.indexOf(res.outliers[j])]
			)

			for (let k = 0; k < group.userIDs.length; k++) {
				let user = await mongo.findUser(group.userIDs[k])
				if (user.phone != null && user.phone != "") {
					twilio.messages.create({
						body: `Something might be wrong with ${userLost.phone}'s owner!`,
						from: "+18445082454",
						to: user.phone
					})
				}
			}
		}
	}
})
