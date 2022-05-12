module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    insertMessage: async function (message) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'messages';
            const messagesCollection = database.collection(collectionName);
            const result = await messagesCollection.insertOne(message);
            client.close();
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    getMessages: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'messages';
            const messagesCollection = database.collection(collectionName);
            const messages = await messagesCollection.find(filter, options).toArray();
            return messages;
        } catch (error) {
            throw (error);
        }
    },
    updateMessage: async function(newMessage, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'messages';
            const messagesCollection = database.collection(collectionName);
            const result = await messagesCollection.updateOne(filter, {$set: newMessage}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    deleteMessagesOfUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'messages';
            const messagesCollection = database.collection(collectionName);
            const result = await messagesCollection.deleteMany(filter, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },

};