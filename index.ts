import express from "express";
import cors from "cors";
import { createAccount, deleteAccount } from "./src/psql/db-operations";
import { getRefToken } from "./src/toronto-water/toronto-water";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.post("/create-account", async (req, res) => {
  try {
    await getRefToken(req.body);
  } catch (err) {
    res
      .status(500)
      .send("Unable to get ref token. Check that it works at MyWaterToronto.");
    return;
  }
  createAccount(
    {
      lastName: req.body.lastName,
      accountNumber: req.body.accountNumber,
      paymentMethod: req.body.paymentMethod,
      postalCode: req.body.postalCode,
      threshold: req.body.threshold || 3,
    },
    req.body.email
  )
    .then((message) => {
      if (message === "Account successfully created!") {
        res.status(201).send(message);
      } else {
        res.status(500).send(message);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/delete-account", async (req, res) => {
  const { email } = req.body;
  try {
    const message = await deleteAccount(email);
    res.status(200).send(message);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
