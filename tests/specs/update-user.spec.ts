import request from 'supertest';
import { ApiPath } from '../api_config/api_path';
import casual from "casual";
import { UserData } from '../models/user-data';
import { BASE_URL } from '../../supertest.config';
import { returnNewUser, setCommonHeaders } from '../helpers/utils';
import { ErrorMessages } from '../api_config/erros';

let testUser: UserData;

beforeEach(async () => {
    testUser = await returnNewUser();
});

describe('User API', () => {
    it('should update user', async () => {
        const updatedUserData = {
            name: "Updated Name",
            email: `${casual.email}`,
            gender: `${casual.random_element(["female", "male"])}`,
            status: `${casual.random_element(["active", "inactive"])}`,
        };
            
        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${testUser.id}`)
            .send(updatedUserData));

        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body).toEqual({
            id: testUser.id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            gender: updatedUserData.gender,
            status: updatedUserData.status
        });

        // Verify that the user is updated
        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}`));

        expect(getUserResponse.status).toBe(200);
        expect(getUserResponse.body).toEqual({
            id: testUser.id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            gender: updatedUserData.gender,
            status: updatedUserData.status
        });
    });

    it('should update user with only name changed', async () => {
        const updatedUserData = {
            name: "Partially Updated Name"
        };

        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${testUser.id}`)
            .send(updatedUserData));

        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body).toEqual({
            id: testUser.id,
            name: updatedUserData.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status
        });

        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}`));
        expect(getUserResponse.status).toBe(200);
        expect(updateUserResponse.body).toEqual({
            id: testUser.id,
            name: updatedUserData.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status
        });
    });

    it('should update user with the same data', async () => {
        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${testUser.id}`)
            .send(testUser));
        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body).toEqual({
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status
        });

        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}`));
        expect(getUserResponse.status).toBe(200);
        expect(getUserResponse.body).toEqual({
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status
        });
    });

    it('should fail to update user with invalid email', async () => {
        const updatedUserData = {
            email: "invalid-email"
        };

        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${testUser.id}`)
            .send(updatedUserData));

        expect(updateUserResponse.status).toBe(422);
        expect(updateUserResponse.body[0].field).toBe("email");
        expect(updateUserResponse.body[0].message).toBe(ErrorMessages.isInvalid);
    });

    it('should fail to update user with missing required fields', async () => {
        const updatedUserData = {
            name: ""
        };

        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${testUser.id}`)
            .send(updatedUserData));

        expect(updateUserResponse.status).toBe(422);
        expect(updateUserResponse.body[0].field).toBe("name");
        expect(updateUserResponse.body[0].message).toBe(ErrorMessages.cantBeBlank);
    });

    it('should fail to update user with invalid user ID', async () => {
        const updatedUserData = {
            name: "Updated Name",
            gender: "male",
            email: `${casual.email}`,
            status: "active"
        };

        const invalidUserId = 0;
        const updateUserResponse = await setCommonHeaders(request(BASE_URL)
            .patch(`${ApiPath.users}/${invalidUserId}`)
            .send(updatedUserData));
        expect(updateUserResponse.status).toBe(404);
    });
});