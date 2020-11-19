const busyUsers = {}

function setUserBusy(userId, channelID) {
	if (!busyUsers[userId])
		busyUsers[userId] = {};
	busyUsers[userId][channelID] = true;
}

function setUserNotBusy(userId, channelID) {
	if (!busyUsers[userId])
		busyUsers[userId] = {};
	busyUsers[userId][channelID] = false;
}

function isUserBusy(userId, channelID) {
	if (!busyUsers[userId])
		return false;
	return !!busyUsers[userId][channelID];
}

module.exports = {
	setUserBusy,
	setUserNotBusy,
	isUserBusy,
}
