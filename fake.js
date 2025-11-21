// I used this to generate 50k rows of fake data for testing

const { faker } = require("@faker-js/faker");
const fs = require("fs");
const { format } = require("fast-csv");

const total = 50000;

const out = fs.createWriteStream("fake_50k.csv");
const csvStream = format({ headers: true });

csvStream.pipe(out);

// customize columns here:
for (let i = 0; i < total; i++) {
  csvStream.write({
    case_id: i + 1,
    applicant_name: faker.person.fullName(),
    dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split('T')[0],
    phone: faker.phone.number(),
    category: faker.helpers.arrayElement(["TAX", "LICENSE", "PERMIT"]),
    priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
    email: faker.internet.email(),
    city: faker.location.city(),
    age: faker.number.int({ min: 18, max: 65 }),
  });
}

csvStream.end();
console.log("Done → fake_50k.csv");
