import { Animal, knownSpecies } from "./animal";

export function sumAnimalsOfDifferentTypes(
  animals: Animal[]
): Record<string, number> {
  const animalMap: Record<string, number> = {};

  for (const animal of animals) {
    if (!(animal.species in animalMap)) {
      animalMap[animal.species] = 0;
    }
    animalMap[animal.species]++;
  }

  return animalMap;
}

export function onlyGetCats(animals: Animal[]): Animal[] {
  return animals.filter((animal) => animal.species === "Cat");
}

export function onlyGetDogs(animals: Animal[]): Animal[] {
  return animals.filter((animal) => animal.species === "Dog");
}

export function onlyGetOthers(animals: Animal[]): Animal[] {
  return animals.filter((animal) => !knownSpecies.includes(animal.species));
}

export function animalScore(animal: Animal): number {
  // the developer no longer gets type hints for species and must manually catch all cases
  switch (animal.species) {
    case "Cat": {
      return -1;
    }
    case "Dog": {
      return 1;
    }
    default: {
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
