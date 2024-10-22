import { mapsy, Narrow } from "mapsy";

interface Person {
  name: string;
  age: number;
  vehicle: Vehicle;
}

type Vehicle = Car | Bike;

interface Car {
  details: {
    type: "car";
    fuel: "electric" | "gas";
    model: string;
    year: number;
  };
  performance: {
    horsepower: number;
    topSpeed: number; // in km/h
  };
}

interface Bike {
  details: {
    type: "bike";
    gear: "fixed" | "multi";
    brand: string;
  };
  specifications: {
    weight: number; // in kg
    frameMaterial: string;
  };
}

type PersonWithCar = Narrow<{
  object: Person;
  nested: ["vehicle"];
  subset: ["details", "type"];
  reduce: "car";
}>;

type PersonWithBike = Narrow<{
  object: Person;
  nested: ["vehicle"];
  subset: ["details", "type"];
  reduce: "bike";
}>;

const describePerson = mapsy<{
  object: Person;
  nested: ["vehicle"];
  subset: ["details", "type"];
  params: [];
  return: string;
}>(["vehicle"], ["details", "type"], {
  car: (person: PersonWithCar) => {
    return `This person drives a ${person.vehicle.details.fuel} car.`;
  },
  bike: (person: PersonWithBike) => {
    return `This person rides a ${person.vehicle.details.gear} bike.`;
  },
});

const personWithCar: PersonWithCar = {
  name: "John",
  age: 25,
  vehicle: {
    details: {
      type: "car",
      fuel: "gas",
      model: "Toyota Corolla",
      year: 2020,
    },
    performance: {
      horsepower: 132,
      topSpeed: 180,
    },
  },
};

console.log(describePerson(personWithCar)); // This person drives a gas car.
