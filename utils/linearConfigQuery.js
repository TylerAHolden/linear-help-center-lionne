export const linearConfigQuery = `
query { 
    teams{
      nodes {
        id
        name
        projects {
          nodes {
            id
            name
          }
        }
        labels {
           nodes {
            id
            name
          }
        }
        states {
          nodes {
            name
            id
            type
          }
        }
      }
    }
    users {
      nodes {
        id
        name
      }
    }
  }
`;
