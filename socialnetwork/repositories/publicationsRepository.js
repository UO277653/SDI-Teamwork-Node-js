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
            client.close();
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
            client.close();
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
            client.close();
            return result;
        } catch (error) {
            throw (error);
        }
    },
    deletePublicationsOfUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'publications';
            const publicationsCollection = database.collection(collectionName);
            const result = await publicationsCollection.deleteMany(filter, options);
            client.close();
            return result;
        } catch (error) {
            throw (error);
        }
    },

};