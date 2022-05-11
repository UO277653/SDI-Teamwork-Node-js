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
            return friendRequests;
        } catch(error) {
            throw(error);
        }
    },

    /*getFriendsPg: async function(filter, options, page) {
        try {
            const limit = this.app.get("pageLimit");
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'friendRequests';
            const friendRequestCollection = database.collection(collectionName);
            const friendsCount = await friendRequestCollection.count();
            const cursor = friendRequestCollection.find(filter, options).skip((page - 1) * limit).limit(limit);
            const friends = await cursor.toArray();
            const result = {friends: friends, total: friendsCount};
            return result;
        } catch(error) {
            throw(error);
        }
    }*/
};