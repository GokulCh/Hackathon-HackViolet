const mongoose = require("mongoose")
// const config = require("./config.json")

let userData = []
let groupData = []
let last_updated = 0

mongoose
	.connect("mongodb+srv://Wiggels:VCnXtLteYnzKuMBB@guardian.aseufm5.mongodb.net/guardiandb?retryWrites=true&w=majority", {
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
		userID: { type: String, require: true, unique: true },
		groupID: { type: String, require: true },
		name: { type: String, require: true },
		lattitude: { type: Number, require: true },
		longitude: { type: Number, require: true },
		phone: { type: String, require: true },
		last_updated: { type: Date, require: true },
		auth: { type: String, require: true }
	},
	{
		collection: "users"
	}
)

const userModel = mongoose.model("user", userSchema)

const groupSchema = new mongoose.Schema(
	{
		groupID: { type: String, require: true, unique: true },
		userIDs: { type: Array, require: true },
		auth: { type: String, require: true }
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
	findUserAndReplace, createUser
}
