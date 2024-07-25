import { ACCESS_TOKEN } from "../../supertest.config";

export function setCommonHeaders(req) {
    return req
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`);
}