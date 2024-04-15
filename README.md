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

## PRs

To get an overview of the choices, check out these PRs in order, and read the commits or the pull request body, along with the code, to see the impact each decision takes.

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
