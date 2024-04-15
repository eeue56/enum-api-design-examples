# enum-api-design-examples
Examples of API designs when using enums

## The API

We're designing an API for animals, and would like to guide the user on what animals we consider valid.

Currently, we support:
- Dog
- Cat

An animal is an object with a species property, represented in pseudo-code as so:

```typescript
type Animal = {
    species: Cat | Dog
}
```

However, there's a problem. While we'd like to guide the user on what species we know about, we will also allow for custom animals.

In pseudo-code, our animal support actually looks like:

```typescript
type Animal = {
    species: Cat | Dog | Custom
}
```

Keeping the explicitly known species will help our users understand our API, but we need to be flexible.

How do we solve that in a reasonable way? To find out, we're going to branch from this commit and demostrate some example options.

## Code

To begin with, we have an animal type and parser in [server/src/animal.ts](server/src/animal.ts) and [client/src/animal.ts](client/src/animal.ts), which both start out the same.
In the server, there's minimal logic, most of which lives in [server/src/index.ts](server/src/index.ts). It exposes a few endpoints:

| Endpoint | Purpose |
| -------- | ------- |
| /reset   | Empty the "database" of all animals |
| /list    | Get all the animals in the database, as an array |
| /list/:species | Get all the animals of a particular species in the database, as an array |
| POST /animal | If valid, add a new animal from the request body |

In the client, there's some logic that a client might typically do in [client/src/logic.ts](client/src/logic.ts). This includes:

- Assigning a score to each animal, and providing the sum
- Providing the count of each species
- Filtering for a particular species, both the two known species (Cat, Dog), and unknown species

There's a test script in [client/src/index.ts](client/src/index.ts), which runs a series of commands against the API and prints the responses. Before making the test requests, it populates the database with some sample animals.

## PRs

To get an overview of the choices, check out these PRs in order, and read the commits or the pull request body, along with the code, to see the impact each decision takes. In each PR, the test script has been run to examine the breaking changes made both client and server side.

### Representing species as a string without restrictions

e.g `type Species = string`

- [Server code](https://github.com/eeue56/enum-api-design-examples/pull/1)
- [Client code to ignore unknown species](https://github.com/eeue56/enum-api-design-examples/pull/2)
- [Also set species to string on the client](https://github.com/eeue56/enum-api-design-examples/pull/3)

### Representing species with a union of two disinct objects

e.g `type Species = { kind: Known, value: string } | { kind: Custom | value: string }`

- [Server code](https://github.com/eeue56/enum-api-design-examples/pull/4)
- [Match server code on the client](https://github.com/eeue56/enum-api-design-examples/pull/5)

## Usage

To run the server and see how data is parsed and handled, do the following:

```
npm install
npm run start-server

npm run start-client
```
