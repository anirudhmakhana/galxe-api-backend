require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Galxe domain
app.use(
  cors({
    origin: "https://app.galxe.com",
  })
);

// Endpoint to check if the address holds Gelato tokens
app.get("/check-gel-holder/:address", async (req, res) => {
  const address = req.params.address.toLowerCase(); // Ensure address is lowercase as EVM addresses are case insensitive
  const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${process.env.GEL_CONTRACT_ADDRESS}&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(url);
    const balance = BigInt(response.data.result);
    // Return 1 if the balance is more than 0, otherwise return 0
    res.json({
      data: {
        is_ok: balance > 0 ? 1 : 0,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ data: { is_ok: 0 } });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
