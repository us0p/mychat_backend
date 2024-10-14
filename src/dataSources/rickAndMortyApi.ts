import { RESTDataSource } from "apollo-datasource-rest";

export class RickAndMortyAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://rickandmortyapi.com/api";
    }

    async getPaginatedCharactersData(pageCount: number) {
        return this.get(`/character/?page=${pageCount}`);
    }
}
