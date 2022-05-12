module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient; this.app = app;
    },

    findRequest: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const requestsCollection = database.collection(collectionName);
            const friendReq = await requestsCollection.findOne(filter, options);
            client.close();
            return friendReq;
        } catch (error) {
            throw (error);
        }
    },

    insertRequest: async function (friendRequest) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const requestsCollection = database.collection(collectionName);
            const result = await requestsCollection.insertOne(friendRequest);
            client.close();
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },

    updateRequest: async function (friendRequest) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const requestsCollection = database.collection(collectionName);

            let filter = {_id: friendRequest._id}
            const result = await requestsCollection.updateOne(filter, {$set: friendRequest}, {});
            client.close();
            return result;
        } catch (error) {
            throw (error);
        }
    },

    getRequests: async function(filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const requestsCollection = database.collection(collectionName);
            const friendRequests = await requestsCollection.find(filter, options).toArray();
            client.close();
            return friendRequests;
        } catch(error) {
            throw(error);
        }
    },
    deleteFriendsOfUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const friendsCollection = database.collection(collectionName);
            const result = await friendsCollection.deleteMany(filter, options);
            client.close();
            return result;
        } catch (error) {
            throw (error);
        }
    },





    areFriends: async function (userEmailA, userEmailB, callback) {
        await this.findRequestBetweenUsers(userEmailA, userEmailB, req => {
            if (req == null)
                callback(false);
            else callback(req.status === "ACCEPTED");
        });
    },

    findRequestBetweenUsers: async function(userEmailA, userEmailB, callback) {
        let filter = { // Requests sent to or received by our user
            $or:[
                {sender: userEmailA, receiver: userEmailB},
                {sender: userEmailB, receiver: userEmailA},
            ]
        }
        this.findRequest(filter, {}).then(async request => {
            callback(request);
        }).catch(error => {
            callback(null);
        });
    },
};