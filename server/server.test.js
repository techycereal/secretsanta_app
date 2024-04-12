const request = require('supertest');
const app = require('./server'); // Assuming your server file exports the Express app
const db = require('./database'); // Import the database module

// Mocking the database.createGroup function
jest.mock('./database', () => ({
  createGroup: jest.fn().mockResolvedValue({ groupCode: '123', groupName: 'Test Group' }),
  add: jest.fn().mockResolvedValue({
    memberId: '5',
    groupCode: '66844',
    name: 'John Doe' 
  }),
  adminSignIn: jest.fn().mockResolvedValue({
    // Mocked return value from the database operation
    // Adjust the return value based on your application's logic
    groupCode: '12345',
    adminCode: 'admin123',
    groupName: 'Admin Group'
  }),
  randomize: jest.fn().mockResolvedValue('true'),
  getAllPairs: jest.fn().mockResolvedValue([
    { personId: '1', personId2: '2', PersonName1: 'John', PersonName2: 'Doe' }]),
  getpairs: jest.fn().mockResolvedValue([
    { personId: '1', personId2: '2', PersonName1: 'John', PersonName2: 'Doe' }
    // Add more mocked pairs as needed
    ]),
    signin: jest.fn().mockResolvedValue([
        { groupId: '1', groupCode: '123', groupName: 'Test Group' }
        // Add more mocked sign-in data as needed
      ]),
    signins: jest.fn().mockResolvedValue([
    { groupId: '1', groupCode: '123', groupName: 'Test Group' }
    // Add more mocked sign-in data as needed
    ]),
    write: jest.fn().mockResolvedValue('Success'),
    removeUser: jest.fn().mockResolvedValue('Success'),
    deleteGroup: jest.fn().mockResolvedValue({
        groupCode: '123', // Mocked group code
      }),
}));

describe('POST /createGroup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new group and send the response', async () => {
    const groupName = 'Test Group';
    const expectedResponse = { groupCode: '123', groupName: 'Test Group' };

    // Make a POST request to the route
    const response = await request(app)
      .post('/createGroup')
      .send({ groupName });

    // Assertions
    expect(response.status).toBe(200); // Check if status is 200 OK
    expect(response.body).toEqual(expectedResponse); // Check if response body matches expected response
    expect(db.createGroup).toHaveBeenCalledWith(groupName); // Check if createGroup function was called with correct arguments
  });
});


describe('POST /add', () => {
    it('should add a new member to the group', async () => {
      const requestBody = {
        groupCode: '66844',
        name: 'John Doe'
      };
  
      const expectedResponse = {
        memberId: '5',
        groupCode: '66844',
        name: 'John Doe'
      };
  
      // Mock the database add function
      db.add.mockResolvedValue(expectedResponse);
  
      // Make a POST request to the route
      const response = await request(app)
        .post('/add')
        .send(requestBody);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
      expect(db.add).toHaveBeenCalledWith(requestBody.groupCode, requestBody.name);
    });
  
    // Add more test cases as needed
  });


  describe('POST /adminsignin', () => {
    it('should perform admin sign-in', async () => {
      const requestBody = {
        groupCode: '12345', // Example groupCode
        adminCode: 'admin123' // Example adminCode
      };
  
      const expectedResponse = {
        // Expected response from the database operation
        // Adjust the response based on your application's logic
        groupCode: '12345',
        adminCode: 'admin123',
        groupName: 'Admin Group'
      };
  
      // Mock the database adminSignIn function
      db.adminSignIn.mockResolvedValue(expectedResponse);
  
      // Make a POST request to the route
      const response = await request(app)
        .post('/adminsignin')
        .send(requestBody);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
      expect(db.adminSignIn).toHaveBeenCalledWith(requestBody.groupCode, requestBody.adminCode);
    });
  
    // Add more test cases as needed
  });


  describe('GET /random/:code', () => {
    it('should randomize elements within a group', async () => {
      const groupCode = '12345'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/random/${groupCode}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.text).toBe('true');
      expect(db.randomize).toHaveBeenCalledWith(groupCode);
    });
  
    // Add more test cases as needed
  });


  describe('GET /getallpairs/:groupcode', () => {
    it('should fetch all pairs for a given group code', async () => {
      const groupCode = '12345'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/getallpairs/${groupCode}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { personId: '1', personId2: '2', PersonName1: 'John', PersonName2: 'Doe' }
        // Add more expected pairs here based on the mocked response
      ]);
      expect(db.getAllPairs).toHaveBeenCalledWith(groupCode);
    });
  
    // Add more test cases as needed
  });



  describe('GET /getpairs/:code/:groupcode', () => {
    it('should fetch pairs for a given code and group code', async () => {
      const code = '123'; // Example code
      const groupCode = '456'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/getpairs/${code}/${groupCode}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { personId: '1', personId2: '2', PersonName1: 'John', PersonName2: 'Doe' }
        // Add more expected pairs here based on the mocked response
      ]);
      expect(db.getpairs).toHaveBeenCalledWith(code, groupCode);
    });
  
    // Add more test cases as needed
  });


  describe('GET /signin/:code', () => {
    it('should fetch group details for a given group code', async () => {
      const code = '123'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/signin/${code}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { groupId: '1', groupCode: '123', groupName: 'Test Group' }
        // Add more expected sign-in data here based on the mocked response
      ]);
      expect(db.signin).toHaveBeenCalledWith(code);
    });
  
    // Add more test cases as needed
  });


  describe('GET /signins/:code', () => {
    it('should fetch sign-in information for a given group code', async () => {
      const code = '123'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/signins/${code}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { groupId: '1', groupCode: '123', groupName: 'Test Group' }
        // Add more expected sign-in data here based on the mocked response
      ]);
      expect(db.signins).toHaveBeenCalledWith(code);
    });
  
    // Add more test cases as needed
  });

  describe('POST /write_list', () => {
    it('should write a list item for a group', async () => {
      const requestBody = {
        groupCode: '123', // Example group code
        user: 'John Doe',
        item: 'Example Item',
      };
  
      // Make a POST request to the route
      const response = await request(app)
        .post('/write_list')
        .send(requestBody);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.text).toBe('Success');
      expect(db.write).toHaveBeenCalledWith(requestBody.groupCode, requestBody.user, requestBody.item);
    });
  
    // Add more test cases as needed
  });


  describe('POST /deleteuser', () => {
    it('should delete a user from a group', async () => {
      const requestBody = {
        groupCode: '123', // Example group code
        personId: '5', // Example person ID
      };
  
      // Make a POST request to the route
      const response = await request(app)
        .post('/deleteuser')
        .send(requestBody);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.text).toBe('Success');
      expect(db.removeUser).toHaveBeenCalledWith(requestBody.groupCode, requestBody.personId);
    });
  
    // Add more test cases as needed
  });

  describe('GET /deletegroup/:code', () => {
    it('should delete a group with the provided code', async () => {
      const groupCode = '123'; // Example group code
  
      // Make a GET request to the route
      const response = await request(app)
        .get(`/deletegroup/${groupCode}`);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ groupCode });
      expect(db.deleteGroup).toHaveBeenCalledWith(groupCode);
    });
  
    // Add more test cases as needed
  });