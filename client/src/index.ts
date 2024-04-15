import { Animal, KnownSpecies, knownSpecies, parseAnimals } from "./animal";
import { animalsScore, sumAnimalsOfDifferentTypes } from "./logic";

const baseUrl = "http://localhost:3000";

async function createValidAnimalOnServer(speices: KnownSpecies) {
  const animal = Animal(speices);
  await fetch(`${baseUrl}/animal`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(animal),
  });
}

async function main() {
  {
    console.log("Populate server with some animals...");

    const response = await fetch(`${baseUrl}/reset`, { method: "POST" });

    if (response.status !== 200) {
      console.log(
        `Failed to reset server, expected 200 response but got ${response.status}`
      );
      return;
    }

    // Have at least one of each species for an example
    await createValidAnimalOnServer("Cat");
    await createValidAnimalOnServer("Dog");

    // Fill server with 5 random animals
    for (let i = 0; i < 5; i++) {
      await createValidAnimalOnServer(
        knownSpecies[Math.floor(Math.random() * knownSpecies.length)]
      );
    }
  }
  console.log();

  {
    console.log("Get all saved animals...");
    const animals = parseAnimals(await (await fetch(`${baseUrl}/list`)).json());

    switch (animals.kind) {
      case "Ok": {
        console.log("Animals: ", animals);
        console.log("Score:", animalsScore(animals.value));
        console.log("Count:", sumAnimalsOfDifferentTypes(animals.value));
        break;
      }
      case "Err": {
        console.log(animals.message);
        break;
      }
    }
  }
  console.log();

  {
    console.log("Try to send a valid animal...");
    const animal = Animal("Cat");
    const response = await fetch(`${baseUrl}/animal`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(animal),
    });
    console.log(response.status);
    if (response.status !== 200) {
      console.log(await response.json());
    }
  }
  console.log();

  {
    console.log("Try to send an invalid animal...");
    const animal = {};
    const response = await fetch(`${baseUrl}/animal`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(animal),
    });
    console.log(response.status);
    if (response.status !== 200) {
      console.log(await response.json());
    }
  }
  console.log();

  {
    console.log("Try to send an animal with an unknown species...");
    const animal = { kind: "Animal", species: "Robot" };
    const response = await fetch(`${baseUrl}/animal`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(animal),
    });
    console.log(response.status);
    if (response.status !== 200) {
      console.log(await response.json());
    }
  }
  console.log();

  {
    console.log("Try to get all animals with a known species...");
    const spieces: KnownSpecies = knownSpecies[0];
    const response = await fetch(`${baseUrl}/list/${spieces}`);
    console.log(response.status);
    if (response.status === 200) {
      const animals = parseAnimals(await response.json());

      switch (animals.kind) {
        case "Ok": {
          console.log("Animals: ", animals);
          console.log("Score:", animalsScore(animals.value));
          console.log("Count:", sumAnimalsOfDifferentTypes(animals.value));
          break;
        }
        case "Err": {
          console.log(animals.message);
          break;
        }
      }
    } else {
      console.log(await response.json());
    }
  }
  console.log();

  {
    console.log("Try to get all animals with an unknown species...");
    const spieces: string = "Robot";
    const response = await fetch(`${baseUrl}/list/${spieces}`);
    console.log(response.status);
    if (response.status === 200) {
      const animals = parseAnimals(await response.json());

      switch (animals.kind) {
        case "Ok": {
          console.log("Animals: ", animals);
          console.log("Score:", animalsScore(animals.value));
          console.log("Count:", sumAnimalsOfDifferentTypes(animals.value));
          break;
        }
        case "Err": {
          console.log(animals.message);
          break;
        }
      }
    } else {
      console.log(await response.json());
    }
  }
  console.log();
}

main();
