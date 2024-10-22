import { it, expect } from "vitest";

import { mapsy, Narrow } from "./";

it("should map the type to the corresponding callback", () => {
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

  const person1: PersonWithCar = {
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

  const person2: PersonWithBike = {
    name: "Jane",
    age: 30,
    vehicle: {
      details: {
        type: "bike",
        gear: "multi",
        brand: "Giant",
      },
      specifications: {
        weight: 10,
        frameMaterial: "aluminum",
      },
    },
  };

  expect(describePerson(person1)).toBe("This person drives a gas car.");
  expect(describePerson(person2)).toBe("This person rides a multi bike.");
});
