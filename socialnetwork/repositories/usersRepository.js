module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient; this.app = app;
    },
    findUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const user = await usersCollection.findOne(filter, options);
            return user;
        } catch (error) {
            throw (error);
        }
    },
    findUsers: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const user = await usersCollection.find(filter, options).toArray();
            return user;
        } catch (error) {
            throw (error);
        }
    },
    insertUser: async function (user) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const result = await usersCollection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },

    getUsers: async function(filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const users = usersCollection.find(filter, options).toArray();
            // console.log(users);
            return users;
        } catch(error) {
            throw(error);
        }
    },
    getUsersPg: async function(filter, options, page) {
        try {
            const limit = this.app.get("pageLimit");
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const usersCount = await usersCollection.count();
            const cursor = usersCollection.find(filter, options).skip((page - 1) * limit).limit(limit);
            const users = await cursor.toArray();
            const result = {users: users, total: usersCount};
            return result;
        } catch(error) {
            throw(error);
        }
    },
    getUsersAdmin: async function(filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const users = await usersCollection.find(filter, options).toArray();
            return users;
        } catch(error) {
            throw(error);
        }
    },
    deleteUser: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const result = await usersCollection.deleteOne(filter, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    deleteUsers: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("socialNetwork");
            const collectionName = 'users';
            const usersCollection = database.collection(collectionName);
            const result = await usersCollection.deleteMany(filter, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
};