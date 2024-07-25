import request from 'supertest';
import { ApiPath } from '../api_config/api_path';
import { UserData } from '../models/user-data';
import { BASE_URL } from '../../supertest.config';
import { returnNewUser, setCommonHeaders } from '../helpers/utils';
import { ErrorMessages } from '../api_config/erros';

let testUser: UserData;

beforeAll(async () => {
    testUser = await returnNewUser();
});

describe('User API', () => {
    it('should get all users', async () => {
        const response = await setCommonHeaders(request(BASE_URL).get(ApiPath.users));
        
        expect(response.status).toBe(200);

        expect(response.body).not.toBeNull();
        expect(response.body).not.toBeUndefined();
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should get a new user', async () => {

        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}`));

        expect(getUserResponse.status).toBe(200);
        expect(getUserResponse.body).toEqual({
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status            
        })
    });

    it('should return 404 for a non-existent user', async () => {
        const response = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}5`));

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: ErrorMessages.resourceNotFound
        });
    });

    it('should return 400 for an invalid user ID', async () => {
        const invalidUserId = 'invalid-id';
        const response = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${invalidUserId}`));

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: ErrorMessages.resourceNotFound
        });
    });
});