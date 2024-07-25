import request from 'supertest';
import { ApiPath } from '../api_path/api_path';
import casual from "casual";
import { UserData } from '../models/user-data';
import { ACCESS_TOKEN, BASE_URL } from '../../supertest.config';
import { setCommonHeaders } from '../helpers/utils';


describe('User API', () => {
    it('should get all users', async () => {
        console.log(ACCESS_TOKEN);
        const response = await setCommonHeaders(request(BASE_URL).get(ApiPath.users));
        
        expect(response.status).toBe(200)

        expect(response.body).not.toBeNull()
        expect(response.body).not.toBeUndefined()
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
    });

    it('should create a new user', async () => {
        const testUser: UserData = {
            name: `${casual.first_name} ${casual.last_name}`,
            email: `${casual.email}`,
            gender: "female",
            status: "active"
        }

        const createUserResponce = await setCommonHeaders(request(BASE_URL)
            .post("/public/v2/users")
            .send(testUser));

        const userId = createUserResponce.body.id;

        expect(createUserResponce.status).toBe(201);

        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${userId}`));

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
            name: `${casual.first_name} ${casual.last_name}`,
            email: `${casual.email}`,
            gender: "male",
            status: "inactive"
        };

        // Create a new user
        const createUserResponse = await setCommonHeaders(request(BASE_URL)
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
            

        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${userId}`)
            .send(updatedUserData));
        expect(updateUserResponse.status).toBe(200);

        // Get the updated user
        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${userId}`));
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
        const createUserResponse = await setCommonHeaders(request(BASE_URL)
            .post(ApiPath.users)
            .send({
                name: `${casual.first_name} ${casual.last_name}`,
                email: `${casual.email}`,
                gender: "male",
                status: "active"
            }));
        const userId = createUserResponse.body.id;
        expect(createUserResponse.status).toBe(201);

        // Delete the user
        const deleteUserResponse = await setCommonHeaders(request(BASE_URL)
            .delete(`${ApiPath.users}/${userId}`));
        expect(deleteUserResponse.status).toBe(204);

        // Verify that the user is deleted
        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${userId}`));
        expect(getUserResponse.status).toBe(404);
    });
});