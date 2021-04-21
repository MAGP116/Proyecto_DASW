
let config = {
    dbUser: 'User',
    password: '06ZrUdXPXUvRmCSm',
    dbName: 'MyDB',
    getUrl: function() {return `mongodb+srv://${this.dbUser}:${this.password}@cluster0.lhfh5.mongodb.net/${this.dbName}?retryWrites=true&w=majority`
        
    }
}

module.exports = config;