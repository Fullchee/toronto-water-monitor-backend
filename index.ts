import express, { NextFunction } from "express";
import cors from "cors";
import { createAccount, deleteAccount } from "./src/psql/db-operations";
import { getRefToken } from "./src/toronto-water/toronto-water";
import { verify } from "jsonwebtoken";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.get("/verify", (req, res) => {
  try {
    const decoded = verify(
      req.query.jwt as string,
      process.env.JWT_SECRET as string
    );
    // TODO: send a web page that will send a post request
    res.status(200).send("Authenticated token!");
  } catch (error) {
    console.error("Invalid JWT");
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Your activation link expired");
    } else {
      return res
        .status(400)
        .send(
          "Something wasn't right with your link. Could you check if you changed the URL accidentally?"
        );
    }
  }
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
