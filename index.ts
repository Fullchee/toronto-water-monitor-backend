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
  if (getRefToken(req.body)) {
    createAccount(req.body)
      .then(() => {
        res.status(201).send("Account successfully created!");
      })
      .catch((err) => {
        throw err;
      });
  } else {
    res
      .status(400)
      .send("Invalid data provided. Check that it works at MyWaterToronto.");
  }
});

app.post("/delete-account", async (req, res) => {
  const { email } = req.body;
  await deleteAccount(email);
  res.status(200).send("Account successfully deleted");
});
