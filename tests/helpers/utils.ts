import casual from "casual";
import { ACCESS_TOKEN, BASE_URL } from "../../supertest.config";
import request from 'supertest';
import { ApiPath } from "../api_config/api_path";
import { UserData } from "../models/user-data";

export function setCommonHeaders(req) {
    return req
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`);
}

export async function returnNewUser() {
    const testUser = {
        name: `${casual.first_name} ${casual.last_name}`,
        email: `${new Date().getTime()}-${casual.email}`,
        gender: `${casual.random_element(["female", "male"])}`,
        status: `${casual.random_element(["active", "inactive"])}`,
    }

    const createUserResponce = await setCommonHeaders(request(BASE_URL)
                .post(ApiPath.users)
                .send(testUser));
    // const userId = createUserResponce.body.id;
    return createUserResponce.body as UserData;
}