import express, { Response } from "express";
import { Animal, parseAnimal, parseSpecies } from "./animal";

function sendAnimal(res: Response<any>, animal: Animal): void {
  res.send(JSON.stringify(animal));
}

function sendAnimals(res: Response<any>, animals: Animal[]): void {
  res.send(JSON.stringify(animals));
}

async function main() {
  const animals: Animal[] = [];

  const app = express();
  app.use(express.json());

  app.post("/reset", (req, res) => {
    animals.splice(0, animals.length);
    res.sendStatus(200);
  });

  app.get("/list", (req, res) => {
    sendAnimals(res, animals);
  });

  app.get("/list/:species", (req, res) => {
    const species = parseSpecies(req.params.species);

    switch (species.kind) {
      case "Ok": {
        res.status(200);
        sendAnimals(
          res,
          animals.filter((animal) => animal.species === species.value)
        );
        return;
      }
      case "Err": {
        res.status(503);
        res.send(JSON.stringify(species.message));
        return;
      }
    }
  });

  app.post("/animal", (req, res) => {
    const body = req.body;
    const newAnimal = parseAnimal(body);

    switch (newAnimal.kind) {
      case "Ok": {
        animals.push(newAnimal.value);
        res.sendStatus(200);
        return;
      }
      case "Err": {
        res.status(503);
        res.send(JSON.stringify(newAnimal.message));
        return;
      }
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();
