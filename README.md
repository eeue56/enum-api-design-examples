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

## Usage

To run the server and see how data is parsed and handled, do the following:

```
npm install
npm run start-server

npm run start-client
```