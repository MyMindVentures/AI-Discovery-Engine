import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Tag {
    id: ID!
    name: String!
  }

  type Contact {
    id: ID!
    firstName: String
    lastName: String
    email: String
    linkedin: String
    title: String
  }

  type Company {
    id: ID!
    name: String!
    domain: String
    website: String
    description: String
    industry: String
    location: String
    size: String
    revenue: String
    funding: String
    logo: String
    linkedin: String
    twitter: String
    tags: [Tag]
    contacts: [Contact]
    createdAt: String
  }

  type Search {
    id: ID!
    query: String!
    status: String!
    createdAt: String
  }

  type SearchResult {
    id: ID!
    company: Company
    relevance: Float
    matchReason: String
  }

  type ExportJob {
    id: ID!
    name: String!
    format: String!
    status: String!
    fileUrl: String
    recordsCount: Int
    createdAt: String
  }

  type Query {
    companies(filter: String, limit: Int, offset: Int): [Company]
    company(id: ID!): Company
    contacts(filter: String): [Contact]
    searches: [Search]
    searchResults(searchId: ID!): [SearchResult]
    exports: [ExportJob]
  }

  type Mutation {
    createExport(name: String!, format: String!, filters: String): ExportJob
  }
`);
