const mongoose = require("mongoose")
const config = require("./config.json")

let userData = []
let groupData = []
let last_updated = 0

mongoose
	.connect(config.mongoConnection, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to Mongo")
	})
	.catch((err) => {
		console.error(err)
	})

const userSchema = new mongoose.Schema(
	{
		userID: { type: Number, require: true, unique: true },
		groupID: { type: Number, require: true },
		name: { type: String, require: true },
		lattitude: { type: Number, require: true },
		longitude: { type: Number, require: true },
		phone: { type: String, require: true },
		last_updated: { type: Date, require: true }
	},
	{
		collection: "users"
	}
)

const userModel = mongoose.model("user", userSchema)

const groupSchema = new mongoose.Schema(
	{
		groupID: { type: Number, require: true, unique: true },
		userIDs: { type: Array, require: true }
	},
	{
		collection: "groups"
	}
)

const groupModel = mongoose.model("group", groupSchema)

async function updateCache() {
	userData = await userModel.find({})
	groupData = await groupModel.find({})
	last_updated = Date.now()
}

async function findAllGroups() {
	if (Date.now() - last_updated > 60 * 1000) await updateCache()
	return groupData
}

async function findAllUsers() {
	if (Date.now() - last_updated > 60 * 1000) await updateCache()
	return userData
}

async function findUser(userID) {
	// if (Date.now() - last_updated > 60 * 1000) await updateCache()
	let user = userData.filter((a) => {
		return a.userID == userID
	})
	if (user.length > 0) return user[0]
	return null
}

async function findGroup(groupID) {
	let group = groupData.filter((a) => {
		return a.groupID == groupID
	})
	if (group.length > 0) return group[0]
	return null
}

async function findUserAndReplace(userID, user) {
	userModel.findOneAndReplace({ userID: userID }, user)
}

// export const find = <K extends keyof MongoMap>(
// 	model: K,
// 	query: Partial<MongoMap[K]>
// ): Promise<MongoMap[K][]> => {
// 	return models[model].find(query)
// }

const createUser = async (data) => {
	let user = await userModel.create(data)
	user.save()
}

const createGroup = async (data) => {
	let group = await groupModel.create(data)
	group.save()
}

function nextGroupID() {
	let max = groupData.sort((a, b) => {
		b.groupID - a.groupID
	})
	return max[0].groupID + 1
}

function nextUserID() {
	let max = userData.sort((a, b) => {
		b.userID - a.userID
	})
	return max[0].userID + 1
}

// groupModel.create({
// 	groupID: "1",
// 	userIDs: ["1", "2", "3"],
// 	auth: "9999"
// })

// userModel.create({
// 	userID: "1",
// 	groupID: "1",
// 	lattitude: 1,
// 	longitude: 2,
// 	phone: null,
// 	last_updated: Date.now(),
// 	auth: "9998"
// })

// userModel.create({
// 	userID: "2",
// 	groupID: "1",
// 	lattitude: 3,
// 	longitude: 4,
// 	phone: "+18043009909",
// 	last_updated: Date.now(),
// 	auth: "9998"
// })

// userModel.create({
// 	userID: "3",
// 	groupID: "1",
// 	lattitude: 4,
// 	longitude: 5,
// 	phone: null,
// 	last_updated: Date.now(),
// 	auth: "9998"
// })

// create({
// 	userID: 1,
// 	groupID: 2,
// 	lattitude: 1,
// 	longitude: 2,
// 	phone: "",
// 	last_updated: "",
// 	auth: ""
// })

module.exports = {
	findAllUsers,
	findAllGroups,
	updateCache,
	findUser,
	findUserAndReplace,
	createUser,
	createGroup,
	nextGroupID,
	nextUserID,
	findGroup
}
