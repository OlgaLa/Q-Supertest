import request from 'supertest';
import { ApiPath } from '../api_config/api_path';
import { UserData } from '../models/user-data';
import { BASE_URL } from '../../supertest.config';
import { returnNewUser, setCommonHeaders } from '../helpers/utils';

let testUser: UserData;

beforeEach(async () => {
    testUser = await returnNewUser();
});

describe('User API', () => {    
    it('should delete user', async () => {       
        const deleteUserResponse = await setCommonHeaders(request(BASE_URL)
            .delete(`${ApiPath.users}/${testUser.id}`));

        expect(deleteUserResponse.status).toBe(204);

        // Verify that the user is deleted
        const getUserResponse = await setCommonHeaders(request(BASE_URL).get(`${ApiPath.users}/${testUser.id}`));
        expect(getUserResponse.status).toBe(404);
    });

    it('should return 404 when deleting a non-existing user', async () => {
        const nonExistingUserId = 0;

        const deleteUserResponse = await setCommonHeaders(request(BASE_URL)
            .delete(`${ApiPath.users}/${nonExistingUserId}`));

        expect(deleteUserResponse.status).toBe(404);
    });

    it('should return 404 when deleting a user with invalid user ID format', async () => {
        const invalidUserId = 'invalid-id';

        const deleteUserResponse = await setCommonHeaders(request(BASE_URL)
            .delete(`${ApiPath.users}/${invalidUserId}`));

        expect(deleteUserResponse.status).toBe(404);
    });
});