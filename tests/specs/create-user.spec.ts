import request from 'supertest';
import { ApiPath } from '../api_config/api_path';
import casual from "casual";
import { UserData } from '../models/user-data';
import { BASE_URL } from '../../supertest.config';
import { setCommonHeaders } from '../helpers/utils';
import { ErrorMessages } from '../api_config/erros';

describe('User API', () => {
    it('should create a new user with valid user data', async () => {
        const testUser: UserData = {
            name: `${casual.first_name} ${casual.last_name}`,
            email: `${casual.email}`,
            gender: `${casual.random_element(["female", "male"])}`,
            status: `${casual.random_element(["active", "inactive"])}`,
        }

        const createUserResponce = await setCommonHeaders(request(BASE_URL)
            .post(ApiPath.users)
            .send(testUser));

        const userId = createUserResponce.body.id;
        expect(createUserResponce.status).toBe(201);
        expect(createUserResponce.body).toEqual({
            id: userId,
            name: testUser.name,
            email: testUser.email,
            gender: testUser.gender,
            status: testUser.status            
        });
    });

    it('should not create a user with empty name', async () => {
        const invalidUser: UserData = {
            name: "",
            email: `${casual.email}`,
            gender: `${casual.random_element(["female", "male"])}`,
            status: `${casual.random_element(["active", "inactive"])}`,
        }

        const response = await setCommonHeaders(request(BASE_URL)
            .post(ApiPath.users)
            .send(invalidUser));

        expect(response.status).toBe(422);
        expect(response.body[0].field).toEqual("name");
        expect(response.body[0].message).toEqual(ErrorMessages.cantBeBlank);
    });

    it('should not create a user with missing required fields', async () => {
        const incompleteUser: any = {
            name: `${casual.first_name} ${casual.last_name}`,
            status: "active"
        }

        const response = await setCommonHeaders(request(BASE_URL)
            .post(ApiPath.users)
            .send(incompleteUser));

        expect(response.status).toBe(422);
        expect(response.body[0].field).toEqual("email");
        expect(response.body[0].message).toEqual(ErrorMessages.cantBeBlank);
    });

    it('should not create a user with an invalid email format', async () => {
        const invalidEmailUser: UserData = {
            name: `${casual.first_name} ${casual.last_name}`,
            email: "invalid-email-format",
            gender: `${casual.random_element(["female", "male"])}`,
            status: `${casual.random_element(["active", "inactive"])}`,
        }

        const response = await setCommonHeaders(request(BASE_URL)
            .post(ApiPath.users)
            .send(invalidEmailUser));

        expect(response.status).toBe(422);
        expect(response.body[0].field).toEqual("email");
        expect(response.body[0].message).toEqual(ErrorMessages.isInvalid);
    });
    
});