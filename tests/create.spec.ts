import request from 'supertest';
import { Utils } from './utils/utils';
import { ApiPath } from './api_path/api_path';

const baseUrl = "https://gorest.co.in/"
const accessToken = process.env.ACCESS_TOKEN;

function setCommonHeaders(req) {
    return req
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`);
}

describe('User API', () => {
    it('should get all users', async () => {
        console.log(accessToken);
        const response = await setCommonHeaders(request(baseUrl).get(ApiPath.users));
        
        expect(response.status).toBe(200)

        expect(response.body).not.toBeNull()
        expect(response.body).not.toBeUndefined()
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
    });

    it('should create a new user', async () => {
        type UserData = {
            name: string
            gender: string
            email: string
            status: string
        };

        const testUser: UserData = {
            name: "Tenali Ramakrishna",
            email: Utils.getRandomEmail(),
            gender: "female",
            status: "active"
        }

        const createUserResponce = await setCommonHeaders(request(baseUrl)
            .post("/public/v2/users")
            .send(testUser));

        const userId = createUserResponce.body.id;

        expect(createUserResponce.status).toBe(201);

        const getUserResponse = await setCommonHeaders(request(baseUrl).get(`${ApiPath.users}/${userId}`));

        expect(getUserResponse.status).toBe(200);

        expect(getUserResponse.body).toEqual({
            id: userId,
            name: testUser.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status            
        })
    });
    
    it('should update user', async () => {
        const userData = {
            name: "Updated Name",
            gender: "male",
            email: Utils.getRandomEmail(),
            status: "inactive"
        };

        // Create a new user
        const createUserResponse = await setCommonHeaders(request(baseUrl)
            .post(ApiPath.users)
            .send(userData));
        const userId = createUserResponse.body.id;
        expect(createUserResponse.status).toBe(201);

        // Update the user
        const updatedUserData = {
            name: "Updated Name",
            gender: userData.gender,
            email: userData.email,
            status: "active"
        };
            

        const updateUserResponse = await setCommonHeaders(request(baseUrl)
            .patch(`${ApiPath.users}/${userId}`)
            .send(updatedUserData));
        expect(updateUserResponse.status).toBe(200);

        // Get the updated user
        const getUserResponse = await setCommonHeaders(request(baseUrl).get(`${ApiPath.users}/${userId}`));
        expect(getUserResponse.status).toBe(200);
        expect(getUserResponse.body).toEqual({
            id: userId,
            name: updatedUserData.name,
            email: updatedUserData.email,
            gender: updatedUserData.gender,
            status: updatedUserData.status
        });
    });

    it('should delete user', async () => {
        // Create a new user
        const createUserResponse = await setCommonHeaders(request(baseUrl)
            .post("/public/v2/users")
            .send({
                name: "John Doe",
                gender: "male",
                email: Utils.getRandomEmail(),
                status: "active"
            }));
        const userId = createUserResponse.body.id;
        expect(createUserResponse.status).toBe(201);

        // Delete the user
        const deleteUserResponse = await setCommonHeaders(request(baseUrl)
            .delete(`/public/v2/users/${userId}`));
        expect(deleteUserResponse.status).toBe(204);

        // Verify that the user is deleted
        const getUserResponse = await setCommonHeaders(request(baseUrl).get(`/public/v2/users/${userId}`));
        expect(getUserResponse.status).toBe(404);
    });
});