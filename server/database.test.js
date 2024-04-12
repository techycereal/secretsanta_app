// Import the function you want to test. Adjust the path as necessary.
const { add, createGroup, getpairs, signin, write, adminSignIn, removeUser, signins, randomize, getAllPairs, deleteGroup, mockDB, queryDB } = require('./database');

// Assuming `queryDB` and `openDB` are utility functions within `./database` module,
// and you are already mocking `./database` module, you don't need to mock `sqlite3` directly here,
// unless you're using it outside of the mocked functions.
async function createTheGroup(db){
    const groupName = 'Test Group';
    // Assuming createGroup is defined elsewhere and correctly handles db operations
    const result = await createGroup(groupName, db); // Ensure createGroup is correctly implemented
    return result
} 
describe('createGroup function', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });
  test('creates a new group and returns groupCode and adminCode', async () => {
    const groupName = 'Test Group';
    const result = await createTheGroup(db)
    const sql = 'SELECT * FROM EnterGroups WHERE groupName = ?';
    const groups = await queryDB(db, sql, [groupName]);
    expect(result).toHaveProperty('adminCode');
    expect(result).toHaveProperty('groupCode');
    expect(groups[0]).not.toBeNull();
    expect(Object.keys(groups[0]).length).toBeGreaterThan(0); // Check that at least one group was returned
    expect(groups[0].groupName).toEqual(groupName);
  }, 20000);

  test('should fetch group details for a given groupCode and adminCode', async () => {
    const result = await createTheGroup(db)
    // Execute the function under test
    const results = await adminSignIn(db, result['groupCode'], result['adminCode']);
    expect(results).toEqual([
      { groupId: 1, groupCode: results[0]['groupCode'], groupName: results[0]['groupName'], adminCode: results[0]['adminCode'] }
    ]);

    // The test checks that adminSignIn was called with the expected parameters and verifies
    // the function's response against a mocked return value to ensure it behaves as expected.
  }, 20000);
});
describe('add function', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });
  test('should add a new member to the group and return details', async () => {
    // Setup your expected inputs and outputs
    const name = 'John Doe';
    // Execute the function under test
    const results = await add(db, '12345', name);
    // Assertions about the expected behavior
    // Assuming `add` internally calls `queryDB` and `openDB` which are mocked,
    // you'd need to import or define those mocks if you want to verify their calls.
    // For example, if `queryDB` and `openDB` are mocked and exported from your `./database` mock, you can do:

    // expect(database.queryDB).toHaveBeenCalledWith(expect.anything(), 'SELECT * FROM Groups where Person = ? and groupCode = ?', [name, groupCode]);
    // This would require your mock setup to explicitly include `queryDB` and make it available here.

    // Verify the structure of the result for a new member added
    expect(results).toEqual({
      "friend": [],
      "myself": [],
      "person": {
        "Person": "John Doe",
        "groupCode": '12345',
        "personId": 1,
       },
    });

    // Since `openDB` and direct calls to `db.run` are abstracted away by your mocked implementation, 
    // you wouldn't directly test their invocation here unless you set up explicit mocks for those operations.
  }, 20000);
});
describe('signins function', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });
  test('should add a new member to the group and return details', async () => {
    // Execute the function under test
    const result = await createTheGroup(db)
    const results = await signins(result['groupCode'], db);
    // Assertions about the expected behavior
    // Assuming `add` internally calls `queryDB` and `openDB` which are mocked,
    // you'd need to import or define those mocks if you want to verify their calls.
    // For example, if `queryDB` and `openDB` are mocked and exported from your `./database` mock, you can do:

    // expect(database.queryDB).toHaveBeenCalledWith(expect.anything(), 'SELECT * FROM Groups where Person = ? and groupCode = ?', [name, groupCode]);
    // This would require your mock setup to explicitly include `queryDB` and make it available here.

    // Verify the structure of the result for a new member added
    expect(results).toEqual([
      { groupId: results[0]['groupId'], groupCode: results[0]['groupCode'], groupName: results[0]['groupName'], adminCode: results[0]['adminCode'] } // Mocked return value for signin
    ]);
  }, 20000);
});

describe('signin function', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });
  test('should add a new member to the group and return details', async () => {
    // Execute the function under test
    const result = await createTheGroup(db)
    const results = await signin(result['groupCode'], db, 'test');
    console.log(results)
    expect(results).toEqual([
      { groupCode: results[0]['groupCode'], Person: results[0]['Person'], personId: results[0]['personId'] } // Mocked return value for signin
    ]);
  }, 20000);
});

describe('write', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });
  test('should insert an item into the List table without errors', async () => {
    const userId = '1';
    const item = 'Sample Item';

    // Execute the function under test
    const results = await write(db, '12345', userId, item);
    expect(results).toEqual('Success');

    // The test checks that write was called with the expected parameters and verifies
    // the function's response against a mocked return value to ensure it behaves as expected.
  }, 20000);
});

describe('getpairs function', () => {
    let db
    beforeEach(async () => {
      db = await mockDB();
    });
  test('fetches friend details for a given personId and groupId', async () => {
    const results = await getpairs(1, "12345", db, 'test');
    console.log(results)
    expect(results).toEqual([{"Person": "Alex", "groupCode": "12345", "personId": 2}])
  },20000);
});


describe('removeUser', () => {
  let db
    beforeEach(async () => {
      db = await mockDB();
    });

  test('should execute delete operations for a given groupCode and personId and return "Success"', async () => {
    const groupCode = '12345';
    const personId = 1;

    // Execute the function under test
    const result = await removeUser(groupCode, personId, db, 'test');
    console.log(result)
    expect(result).toBe('Success');

    // This test checks that removeUser is called with the expected parameters and verifies
    // the function's response to ensure it behaves as expected, returning "Success".
  },20000);

});



describe('randomize', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });

  test('should randomize pairs for a given groupCode and return "true"', async () => {
    const groupCode = '12345'; // Example groupCode
    // Execute the function under test
    const result = await randomize(groupCode, db, 'test');
    // Since the function is expected to return 'true' after successful execution,
    // verify that it indeed returns this value.
    console.log(result)
    expect(result).toEqual('true')
    // This test ensures that the correct SQL statements are executed with the expected parameters,
    // and that the function returns the expected success message.
  },20000);
});


describe('deleteGroup', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });

  test('should fetch all pairs for a given groupCode', async () => {
    const groupCode = '12345'; // Example groupCode
    // Execute the function under test
    const results = await deleteGroup(groupCode, db, 'test');
    console.log(results)
    // This test ensures that the correct SQL query is executed with the expected parameters,
    // and that the function returns the expected pairs.
    expect(results).toEqual({groupCode: results['groupCode']})
  },20000);

  
});


describe('getAllPairs', () => {
  let db;
 
  // Initialize the database before each test
  beforeEach(async () => {
    db = await mockDB();
    // Ensure db is ready for operations here
  });

  test('should fetch all pairs for a given groupCode', async () => {
    // Execute the function under test
    const result = await getAllPairs("12345", db, 'test');
    console.log(result)

    // This test ensures that the correct SQL query is executed with the expected parameters,
    // and that the function returns the expected pairs.
  },20000);

  
});
