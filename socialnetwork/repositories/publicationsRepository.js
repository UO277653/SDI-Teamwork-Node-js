module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },
    getPublications: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'publications';
            const publicationsCollection = database.collection(collectionName);
            const publications = await publicationsCollection.find(filter, options).toArray();
            return publications;
        } catch (error) {
            throw (error);
        }
    },
    insertPublication: async function (publication) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'publications';
            const publicationsCollection = database.collection(collectionName);
            const result = await publicationsCollection.insertOne(publication);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    getPublicationsPg: async function (filter, options, page) {
        try {
            const limit = 2;
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'publications';
            const publicationsCollection = database.collection(collectionName);
            const publicationsCollectionCount = await publicationsCollection.count();
            const cursor = publicationsCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const publications = await cursor.toArray();
            const result = {publications: publications, total: publicationsCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    }

};