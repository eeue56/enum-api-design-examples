import { Err, Ok, Result } from "./result";

export const knownSpecies = ["Dog", "Cat"] as const;

// this is the same as "Dog" | "Cat"
export type KnownSpecies = (typeof knownSpecies)[number];

function isKnownSpecies(species: any): species is KnownSpecies {
  return knownSpecies.includes(species);
}

export type Animal = {
  kind: "Animal";
  species: KnownSpecies;
};

export function Animal(species: KnownSpecies): Animal {
  return {
    kind: "Animal",
    species,
  };
}

function indent(body: string): string {
  return body
    .split("\n")
    .map((line) => (line.trim().length === 0 ? "" : `---> ${line}`))
    .join("\n");
}

export function parseSpecies(json: any): Result<KnownSpecies, string> {
  if (typeof json !== "string") {
    return Err(`Expected one of: ${knownSpecies.join(" | ")}
But got: ${typeof json}`);
  }

  if (!isKnownSpecies(json)) {
    return Err(`Expected one of: ${knownSpecies.join(" | ")}
But got: ${json}`);
  }

  return Ok(json);
}

export function parseAnimal(json: any): Result<Animal, string> {
  if (typeof json !== "object") {
    return Err(`Expected object but got ${typeof json}`);
  }

  if (json === null) {
    return Err(`Expected object but got null`);
  }

  if (!json.species) {
    return Err("Expected object to have `.species` but got nothing.");
  }

  const species = parseSpecies(json.species);

  switch (species.kind) {
    case "Ok": {
      return Ok({ kind: "Animal", species: species.value });
    }
    case "Err": {
      return Err(`Error parsing \`.species\`:\n${indent(species.message)}`);
    }
  }
}

export function parseAnimals(json: any): Result<Animal[], string> {
  if (typeof json !== "object") {
    return Err(`Expected array but got ${typeof json}`);
  }

  if (json === null) {
    return Err(`Expected object but got null`);
  }

  if (!Array.isArray(json)) {
    return Err("Expected array but got object");
  }

  const maybeAnimals = json.map((animal) => parseAnimal(animal));

  const animals: Animal[] = [];
  const errors: string[] = [];

  let i = 0;
  for (const animal of maybeAnimals) {
    switch (animal.kind) {
      case "Ok": {
        animals.push(animal.value);
        break;
      }
      case "Err": {
        errors.push(`Error at animal ${i}:\n${indent(animal.message)}`);
        break;
      }
    }
    i++;
  }

  if (errors.length > 0) {
    return Err(errors.join("\n"));
  }

  return Ok(animals);
}
