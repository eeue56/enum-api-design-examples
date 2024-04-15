import { Animal } from "./animal";

export function sumAnimalsOfDifferentTypes(
  animals: Animal[]
): Record<string, number> {
  const animalMap: Record<string, number> = {};

  for (const animal of animals) {
    if (!(animal.species.value in animalMap)) {
      animalMap[animal.species.value] = 0;
    }
    animalMap[animal.species.value]++;
  }

  return animalMap;
}

export function onlyGetCats(animals: Animal[]): Animal[] {
  // Need to filter to known species to get type completion
  return animals.filter(
    (animal) =>
      animal.species.kind === "KnownSpecies" && animal.species.value === "Cat"
  );
}

export function onlyGetDogs(animals: Animal[]): Animal[] {
  // Need to filter to known species to get type completion
  return animals.filter(
    (animal) =>
      animal.species.kind === "KnownSpecies" && animal.species.value === "Dog"
  );
}

export function onlyGetOthers(animals: Animal[]): Animal[] {
  return animals.filter((animal) => animal.species.kind == "CustomSpecies");
}

export function animalScore(animal: Animal): number {
  switch (animal.species.kind) {
    case "KnownSpecies": {
      switch (animal.species.value) {
        case "Cat": {
          return -1;
        }
        case "Dog": {
          return 1;
        }
      }
    }
    case "CustomSpecies": {
      return 0;
    }
  }
}

export function animalsScore(animals: Animal[]): number {
  let score = 0;

  for (const animal of animals) {
    score += animalScore(animal);
  }

  return score;
}
