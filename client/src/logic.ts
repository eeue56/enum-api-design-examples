import { Animal, KnownSpecies, knownSpecies } from "./animal";

export function sumAnimalsOfDifferentTypes(
  animals: Animal[]
): Record<string, number> {
  const animalMap: Record<KnownSpecies, number> = {
    Cat: 0,
    Dog: 0,
  };

  for (const animal of animals) {
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
  switch (animal.species) {
    case "Cat": {
      return -1;
    }
    case "Dog": {
      return 1;
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
