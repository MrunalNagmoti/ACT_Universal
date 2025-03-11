require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;


mongoose.connect(MONGOURL)

.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

const Wallet = mongoose.model(
  "Wallet",
  new mongoose.Schema({
    address: { type: String, unique: true },
    provider: String,
    usdtBalance: String,
  })
);

// Check if wallet address exists
app.post("/connect-wallet", async (req, res) => {
  const { address } = req.body;
  let existingWallet = await Wallet.findOne({ address });

  if (existingWallet) {
    return res.json({ exists: true, ...existingWallet.toObject() });
  } else {
    return res.json({ exists: false });
  }
});

// Store new wallet
app.post("/store-wallet", async (req, res) => {
    const { address, provider, usdtBalance } = req.body;
    try {
      const newWallet = new Wallet({ address, provider, usdtBalance });
      await newWallet.save();
      return res.json(newWallet);
    } catch (error) {
      console.error("Error storing wallet:", error);
      res.status(500).json({ error: "Server error" });
    }
  });


