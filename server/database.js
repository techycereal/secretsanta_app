// Import the necessary module for SQL Server operations
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
let sqls

 
function queryDB(db, sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


async function mockDB() {
    try {
        const db = await open({filename:":memory:", driver: sqlite3.Database});
        await db.exec('CREATE TABLE IF NOT EXISTS EnterGroups (groupId INTEGER PRIMARY KEY NOT NULL, groupCode TEXT, groupName TEXT, adminCode TEXT)');
        await db.exec('CREATE TABLE IF NOT EXISTS Groups (groupCode TEXT, Person TEXT, personId INTEGER PRIMARY KEY)');
        await db.exec('CREATE TABLE IF NOT EXISTS List (groupId INTEGER, personId INTEGER, item TEXT)');
        await db.exec('CREATE TABLE IF NOT EXISTS Pairs (groupId INTEGER, personId INTEGER, personId2 INTEGER)')
        return db;
    } catch (err) {
        console.error(err)
    }
}


/**
 * Creates a new group in the database.
 * @param {string} name - The name of the group to be created.
 * @returns {object} An object containing the groupCode and adminCode.
 */
async function createGroup(name, db) {
    const groupCode = Math.random().toString().slice(2, 7);
    const adminCode = Math.random().toString().slice(2, 7);
    sqls = 'INSERT INTO EnterGroups (groupCode, adminCode, groupName) VALUES (?,?,?)'
    // await new Promise((resolve, reject) => {
    //     db.run(sqls, [groupCode, adminCode, name], function(err) {
    //         if (err) reject(err);
    //         else resolve(this);
    //     });
    // });
    await db.run(sqls, [groupCode, adminCode, name])
    return {
        groupCode: groupCode,
        adminCode: adminCode
    }
}

async function deleteGroup(groupCode, db, test) {
    try {
        if (test === 'test'){
            sqls = 'insert into EnterGroups (groupCode, groupName, adminCode) VALUES ("12345", "Test Group", "Admin Code")'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person) VALUES ("12345", "Alex")'
            db.run(sqls)    
            sqls = 'insert into Pairs (groupId, personId, personId2) VALUES ("12345", 1, 2)'
            db.run(sqls)
            sqls = 'insert into List (groupId, personId, item) VALUES ("12345", 1, "New Item")'
            db.run(sqls)    
        }
        sqls = 'delete from EnterGroups where groupCode = ?'
        db.run(sqls, [groupCode])
        sqls = 'delete from Groups where groupCode = ?'
        db.run(sqls, [groupCode])
        sqls = 'delete from Pairs where groupId = ?'
        db.run(sqls, [groupCode])
        sqls = 'delete from List where groupId = ?'
        db.run(sqls, [groupCode])
        return {
            groupCode: groupCode
        }
        // var poolConnection = await sql.connect(config);
        // await poolConnection.request()
        //     .input('groupCode', sql.VarChar, groupCode)
        //     .query('delete from SSEnterGroups where groupCode = @groupCode');
        // await poolConnection.request()
        //     .input('groupCode', sql.VarChar, groupCode)
        //     .query('delete from SSGroups where groupCode = @groupCode');
        // await poolConnection.request()
        //     .input('groupCode', sql.VarChar, groupCode)
        //     .query('delete from SSPairs where groupId = @groupCode');
        // await poolConnection.request()
        //     .input('groupCode', sql.VarChar, groupCode)
        //     .query('delete from SSList where groupId = @groupCode');
        // poolConnection.close();
        // return {
        //     groupCode: groupCode,
        //     adminCode: adminCode
        // };
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Adds a new member to an existing group or creates a new member if not exist.
 * @param {string} groupCode - The code of the group.
 * @param {string} name - The name of the member to add.
 * @returns {object} An object containing member lists and personId.
 */
async function add(db, groupCode, name) {
    try {
        sqls = 'SELECT * FROM Groups WHERE Person = ? and groupCode = ?';
        const query = await queryDB(db, sqls, [name, groupCode]);
        console.log(query)
        if (query.length >= 1){
            sqls = 'SELECT L.personId, L.item, G.Person FROM Pairs P INNER JOIN List L ON P.personId2 = L.personId INNER JOIN Groups G ON L.personId = G.personId WHERE P.personId = ? AND L.groupId = ?;'
            const friend_list = await queryDB(db, sqls, [query[0]['personId'], groupCode]);
            console.log(friend_list)
            console.log("friend_list")
            sqls = 'SELECT * from List where groupId = ? and personId = ?'
            const my_list = await queryDB(db, sqls, [groupCode, query[0]['personId']]);
            const together = {
                'myself': my_list,
                'friend': friend_list,
                'person': query[0].personId
            }
            return together
        } else {
            sqls = 'insert into Groups (groupCode, Person) VALUES (?,?)'
            await db.run(sqls, [groupCode, name])
            sqls = 'select * from Groups Where Person = ? and groupCode = ?'
            const querying = await queryDB(db, sqls, [name, groupCode])
            console.log(querying)
            const together = {
                'myself': [],
                'friend': [],
                'person': querying[0]
            }
            return together
        }
    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
    //     const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('name', sql.VarChar, name).query('SELECT * FROM [dbo].[SSGroups] where Person = @name and groupCode = @groupCode');
    //     if (query.recordset.length >= 1){
    //         const friend_list = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.Int, query.recordset[0].personId).query('SELECT DISTINCT [dbo].[SSList].personId, [dbo].[SSList].item, [dbo].[SSGroups].Person FROM [dbo].[SSList] INNER JOIN [dbo].[SSPairs] ON [dbo].[SSList].personId = [dbo].[SSPairs].personId inner join [dbo].[SSGroups] on [dbo].[SSList].personId = [dbo].[SSGroups].personId WHERE [dbo].[SSList].groupId = @groupCode and [dbo].[SSPairs].personId2 = @personId');
    //         console.log(friend_list.recordset)
    //         console.log('-------------------------------------')
    //         const my_list = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.Int, query.recordset[0].personId).query('SELECT * from [dbo].[SSList] where groupId = @groupCode and personId = @personId');
    //         poolConnection.close();
    //         const together = {
    //             'myself': my_list.recordset,
    //             'friend': friend_list.recordset,
    //             'person': query.recordset[0].personId
    //         }
    //         return together
    //     } else {
    //         console.log('here')
    //         await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('name', sql.VarChar, name).query('insert into SSGroups (groupCode, Person) VALUES (@groupCode, @name)');
    //         const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('name', sql.VarChar, name).query('SELECT * FROM [dbo].[SSGroups] where Person = @name and groupCode = @groupCode');
    //         poolConnection.close();
    //         const together = {
    //             'myself': [],
    //             'friend': [],
    //             'person': query.recordset[0]
    //         }
    //         return together
    //     }
        
    // } catch (err) {
    //     console.error(err.message);
    // }
}

async function getpairs(code, groupCode, db, test){
    try {
        if (test === 'test'){
            sqls = 'insert into Pairs (groupId, personId, personId2) VALUES ("12345", 1, 2)'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person, personId) VALUES ("12345", "Alex", 2)'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person, personId) VALUES ("12345", "Daniel", 1)'
            db.run(sqls)
        }
        sqls = 'SELECT * FROM Pairs where personId = ? and groupId = ?';
        const query = await queryDB(db, sqls, [code, groupCode]);
        console.log(query)
        console.log("query get pairs")
        sqls = 'SELECT * FROM Groups where personId = ? and groupCode = ?'
        const myFriend = await queryDB(db, sqls, [query[0]['personId2'], groupCode]);
        return myFriend

    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
    //     const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.VarChar, code).query('SELECT * FROM [dbo].[SSPairs] where personId = @personId and groupId = @groupCode');
    //     const myFriend = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.Int, query.recordset[0]['personId2']).query('SELECT * FROM [dbo].[SSGroups] where personId = @personId and groupCode = @groupCode');
    //     return myFriend.recordset
    // } catch(err) {
    //     console.error(err.message)
    // }
}

async function getAllPairs(groupCode, db, test){
    try {
        if (test === 'test'){
            sqls = 'insert into Pairs (groupId, personId, personId2) VALUES ("12345", 1, 2)'
            db.run(sqls)
            sqls = 'insert into Pairs (groupId, personId, personId2) VALUES ("12345", 2, 1)'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person, personId) VALUES ("12345", "Alex", 2)'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person, personId) VALUES ("12345", "Daniel", 1)'
            db.run(sqls)
        }
        // Simplified and improved SQL query
sqls = `
SELECT 
    Pairs.personId, 
    Pairs.personId2, 
    SG1.Person AS PersonName1, 
    SG2.Person AS PersonName2 
FROM 
    Pairs
INNER JOIN 
    Groups AS SG1 ON Pairs.personId = SG1.personId AND SG1.groupCode = ?
INNER JOIN 
    Groups AS SG2 ON Pairs.personId2 = SG2.personId AND SG2.groupCode = SG1.groupCode`;

// Assuming queryDB is an async function that correctly handles SQLite queries with Promises
        const query = await queryDB(db, sqls, [groupCode]);
        return query

    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
    //     const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('SELECT SSPairs.personId, SSPairs.personId2, SG1.Person AS PersonName1, SG2.Person AS PersonName2 FROM [dbo].[SSPairs] AS SSPairs INNER JOIN [dbo].[SSGroups] AS SG1 ON SSPairs.personId = SG1.personId AND SG1.groupCode = @groupCode INNER JOIN [dbo].[SSGroups] AS SG2 ON SSPairs.personId2 = SG2.personId AND SG2.groupCode = 20796 WHERE SG1.groupCode = @groupCode;');
    //     return query.recordset
    // } catch(err) {
    //     console.error(err.message)
    // }
}


/**
 * Randomizes group elements and creates new pairings.
 * @param {string} groupCode - The code of the group to randomize.
 * @returns {string} 'true' if the operation was successful.
 */
async function randomize(groupCode, db, test) {
    try {
        if (test == 'test'){
            sqls = 'insert into Groups (groupCode, Person) Values ("12345", "Alex")'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person) Values ("12345", "Daniel")'
            db.run(sqls)
            sqls = 'insert into Groups (groupCode, Person) Values ("12345", "Andrew")'
            db.run(sqls)
        }
        sqls = 'SELECT Groups.groupCode FROM Groups INNER JOIN Pairs ON Groups.groupCode = Pairs.groupId WHERE Pairs.groupId = ? LIMIT 1;';
        const getGroup = await queryDB(db, sqls, [groupCode]);
        if (getGroup) {
            sqls = 'delete FROM Pairs where groupId = ?';
            db.run(sqls, [groupCode])
        }
        sqls = 'SELECT * FROM Groups WHERE groupCode = ? ORDER BY RANDOM();'
        const query = await queryDB(db, sqls, [groupCode]);
        let first = query[0].personId
        for (let i = 0; i < query.length; i++) {
            if (i === query.length-1){
                sqls = 'insert into Pairs (groupId, personId, personId2) VALUES (?, ?, ?)'
                db.run(sqls, [groupCode, query[i].personId, first])
                return 'true'
            }
            sqls = 'insert into Pairs (groupId, personId, personId2) VALUES (?, ?, ?)'
            db.run(sqls, [groupCode, query[i].personId, query[i+1].personId])
        }
    return 'true'
    } catch (err) {
        console.error(err.message)
    }

    // try {
    //     var poolConnection = await sql.connect(config);
    //     const getGroup = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('SELECT TOP 1 groupCode FROM [dbo].[SSGroups] INNER JOIN [dbo].[SSPairs] ON [dbo].[SSGroups].groupCode = [dbo].[SSPairs].groupId WHERE [dbo].[SSPairs].groupId = @groupCode;')
    //     if (getGroup.recordset){
    //         await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('delete FROM [dbo].[SSPairs] where groupId = @groupCode');
    //     } 
    //         const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('SELECT * FROM [dbo].[SSGroups] where groupCode = @groupCode ORDER BY NEWID();');
    //         let first = query.recordset[0].personId
    //         for (let i = 0; i < query.recordset.length; i++) {
    //             if (i === query.recordset.length-1){
    //                 await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.Int, query.recordset[i].personId).input('personId2', sql.Int, first).query('insert into SSPairs (groupId, personId, personId2) VALUES (@groupCode, @personId, @personId2)');    
    //                 return 'true'
    //             }
    //             await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('personId', sql.Int, query.recordset[i].personId).input('personId2', sql.Int, query.recordset[i+1].personId).query('insert into SSPairs (groupId, personId, personId2) VALUES (@groupCode, @personId, @personId2)');
    //         }
    //         poolConnection.close();
    // } catch (err) {
    //     console.error(err.message);
    // }
}

/**
 * Signs in a user to the group.
 * @param {string} groupCode - The code of the group to sign in.
 * @returns {object|string} Group records or 'No group by that code'.
 */


async function signin(groupCode, db, test) {
    try {
        if (test == 'test'){
            db.run('insert into Groups (groupCode, Person, personId) VALUES (?, "Alex", 1)', [groupCode])
        }
        sqls = 'SELECT * FROM Groups where groupCode = ?'
        const query = await queryDB(db, sqls, [groupCode])
        return query
    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
        
    //     const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('SELECT * FROM [dbo].[SSGroups] where groupCode = @groupCode');
        
    //     if (query.recordset.length < 1){
    //         poolConnection.close();
    //         return 'No group by that code'
    //     } else {
    //         poolConnection.close();
    //         return query.recordset
    //     }
        
    // } catch (err) {
    //     console.error(err.message);
    // }
}

/**
 * Retrieves sign-in information for a group.
 * @param {string} groupCode - The code of the group.
 * @returns {object|string} Group records or 'No group by that code'.
 */
async function signins(groupCode,db) {
    try {
        sqls = 'select * from EnterGroups where groupCode = ?'
        const news = await queryDB(db, sqls, [groupCode]);
        return news
    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
        
    //     const query = await poolConnection.request().input('groupCode', sql.VarChar, groupCode).query('SELECT * FROM [dbo].[SSEnterGroups] where groupCode = @groupCode');
        
    //     if (query.recordset.length < 1){
    //         poolConnection.close();
    //         return 'No group by that code'
    //     } else {
    //         poolConnection.close();
    //         return query.recordset
    //     }
        
    // } catch (err) {
    //     console.error(err.message);
    // }
}

/**
 * Writes an item to the list for a specific user and group.
 * @param {string} groupCode - The code of the group.
 * @param {string} userId - The ID of the user.
 * @param {string} item - The item to add to the list.
 */
async function write(db, groupCode, userId, item) {
    try {
        sqls = 'insert into List (groupId, personId, item) values (?, ?, ?)'
        db.run(sqls, [groupCode, userId, item])
        return 'Success'
    } catch (err) {
        console.error(err.message)
    }
    // try {
    //     var poolConnection = await sql.connect(config);
    //     await poolConnection.request().input('groupCode', sql.VarChar, groupCode).input('userId', sql.Int, userId).input('item', sql.VarChar, item).query('insert into SSList (groupId, personId, item) values (@groupCode, @userId, @item)');
    //     poolConnection.close();
    // } catch (err) {
    //     console.error(err.message);
    // }
}

/**
 * Admin sign-in functionality.
 * @param {string} groupCode - The code of the group.
 * @param {string} adminCode - The admin code for authentication.
 * @returns {object} The recordset of the admin sign-in query.
 */
async function adminSignIn(db, groupCode, adminCode){
    try {
        sqls = `SELECT * FROM EnterGroups WHERE groupCode = ? AND adminCode = ?`;
        const query = await queryDB(db, sqls, [groupCode, adminCode]);
        return query
    } catch (err) {
        console.error(err.message)
    }
}

/**
 * Removes a user from a group.
 * @param {string} groupCode - The code of the group.
 * @param {number} personId - The ID of the person to remove.
 */
async function removeUser(groupCode, personId, db, test){

    try {
        if (test == 'test'){
            sqls = 'insert into Groups (groupCode, Person) Values ("12345", "Alex")'
            db.run(sqls)
            sqls = 'insert into Pairs (groupId, personId, personId2) Values ("12345", 1, 2)'
            db.run(sqls)
        }
        sqls = 'delete from Groups where groupCode = ? and personId = ?'
        db.run(sqls, [groupCode, personId])
        sqls = 'delete from Pairs where groupId = ? and (personId = ? or personId2 = ?)'
        db.run(sqls, [groupCode, personId])
        return 'Success'
    } catch (err) {
        console.error(err.message)
    }
}



// Exporting the functions to be used in other parts of the application
exports.createGroup = createGroup;
exports.add = add;
exports.randomize = randomize;
exports.signin = signin;
exports.write = write;
exports.adminSignIn = adminSignIn;
exports.signins = signins;
exports.removeUser = removeUser;
exports.deleteGroup = deleteGroup
exports.getpairs = getpairs
exports.getAllPairs = getAllPairs
exports.mockDB = mockDB
exports.queryDB = queryDB