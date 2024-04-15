import { Err, Ok, Result } from "./result";

export const knownSpecies = ["Dog", "Cat"];

export type Animal = {
  kind: "Animal";
  species: string;
};

export function Animal(species: string): Animal {
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

export function parseSpecies(json: any): Result<string, string> {
  if (typeof json !== "string") {
    return Err(`Expected one of: ${knownSpecies.join(" | ")}, or a string
But got: ${typeof json}`);
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
