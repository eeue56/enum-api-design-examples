import { Err, Ok, Result } from "./result";

export const registeredSpecies = ["Dog", "Cat"] as const;

// this is the same as "Dog" | "Cat"
export type RegisteredSpecies = (typeof registeredSpecies)[number];

function isRegisteredSpecies(species: any): species is RegisteredSpecies {
  return registeredSpecies.includes(species);
}

export type KnownSpecies = {
  kind: "KnownSpecies";
  value: RegisteredSpecies;
};

export function KnownSpecies(species: RegisteredSpecies): KnownSpecies {
  return {
    kind: "KnownSpecies",
    value: species,
  };
}

export type CustomSpecies = { kind: "CustomSpecies"; value: string };

export function CustomSpecies(species: string): CustomSpecies {
  return {
    kind: "CustomSpecies",
    value: species,
  };
}

export type Species = KnownSpecies | CustomSpecies;

export function isEqualSpecies(first: Species, second: Species): boolean {
  if (first.kind !== second.kind) return false;

  return first.value === second.value;
}

export type Animal = {
  kind: "Animal";
  species: Species;
};

export function Animal(speciesAsAString: string): Animal {
  let species = isRegisteredSpecies(speciesAsAString)
    ? KnownSpecies(speciesAsAString)
    : CustomSpecies(speciesAsAString);

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

export function parseSpecies(json: any): Result<Species, string> {
  if (typeof json !== "object") {
    return Err(`Expected an object with kind KnownSpecies | CustomSpecies
But got: ${typeof json}`);
  }

  if (json === null) {
    return Err(`Expected object but got null`);
  }

  if (
    !json.kind ||
    !(json.kind === "KnownSpecies" || json.kind === "CustomSpecies")
  ) {
    return Err(`Expected object to have \`.kind\` with value KnownSpecies | CustomSpecies
But got ${json.kind}.`);
  }

  if (!json.value) {
    return Err(`Expected object to have \`.value\` with value ${registeredSpecies.join(
      " | "
    )} | string
But got ${json.value}.`);
  }

  const kind: "KnownSpecies" | "CustomSpecies" = json.kind;
  const value = json.value;

  if (kind === "KnownSpecies") {
    if (isRegisteredSpecies(value)) {
      return Ok(KnownSpecies(value));
    }
    return Err(`Expected object to have \`.value\` with value ${registeredSpecies.join(
      " | "
    )}
But got ${json.value}.`);
  }

  return Ok(CustomSpecies(value));
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
