export type Member = {
    id:          string;
    dateOfBirth: string;
    imageUrl?:    string;
    displayName: string;
    description?: string;
    created:     string;
    lastActive:  string;
    gender:      string;
    city:        string;
    country:     string;
}

export type EditableMember = {
    displayName: string;
    description?: string;
    city:        string;
    country:     string;
}

export class MemberParams{
    gender?: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 10;
orderBy = "lastActive";
}