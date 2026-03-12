export const API_BASE_URL = "http://127.0.0.1:8000";

// Add typed models and API wrapper methods as needed.
export interface User {
    id: number;
    username: string;
    has_voted: boolean;
    voter_id_hash: string;
}

export interface Candidate {
    id: number;
    name: string;
    voteCount: number;
}
