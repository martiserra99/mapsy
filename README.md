# mapsy

The `mapsy` utility function is used to map a value to a corresponding function based on the type of the value.

To illustrate better how it works imagine we had the following types:

```ts
interface Person<T extends Vehicle> {
  name: string;
  age: number;
  vehicle: T;
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
```

If we wanted to create a function called `describePerson` that receives a person as
argument and returns different data depending on the vehicle that the person has we
could use the `mapsy` function the following way:

```ts
import { mapsy } from "mapsy";

// ...

const describePerson = mapsy<{
  object: Person<Vehicle>;
  nested: ["vehicle"];
  subset: ["details", "type"];
  params: [];
  return: string;
}>(["vehicle"], ["details", "type"], {
  car: (person: Person<Car>) => {
    return `This person drives a ${person.vehicle.details.fuel} car.`;
  },
  bike: (person: Person<Bike>) => {
    return `This person rides a ${person.vehicle.details.gear} bike.`;
  },
});

const personWithCar: Person<Car> = {
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
```

The type that the function receives is an object with the following properties:

- `object`: The object type we are dealing with.
- `nested`: The path to the key that we want to narrow down.
- `subset`: The path to the discriminator key used to extract the subset.
- `params`: The extra parameters of the returned function.
- `return`: The return type of the returned function.

The function parameters that the functions receives are the following:

- The path to the key that we want to narrow down.
- The path to the discriminator key used to extract the subset.
- An object with the corresponding functions.

## Narrow utility type

If the `Person` type was not generic we would need to use the `Narrow` utility
type as you can see here:

```ts
import { mapsy, Narrow } from "mapsy";

interface Person {
  name: string;
  age: number;
  vehicle: Vehicle;
}

// ...

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
```
