if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const session = require("express-session");
const flash = require("express-flash");
mongoose.connect("mongodb://0.0.0.0/ChaperoneMagazine");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//express flash middleware
app.use(flash());

app.get("/", (req, res) => {
  res.render("magazines/index");
});

// register
app.get("/324G478NX", (req, res) => {
  res.render("324G478NX");
});

app.post("/324G478NX", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    req.flash("success_msg", "Registration successful");
    res.redirect("/login");
  } catch (err) {
    req.flash("error_msg", "An error occurred during registration.");
    res.redirect("/register");
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error_msg", "Wrong username");
      return res.redirect("/login");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      req.flash("error_msg", "Wrong password.");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success_msg", "Login successful!");
    res.redirect("/user/dashboard");
  } catch (err) {
    req.flash("error_msg", "An error occurred during login.");
    res.redirect("/login");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully.");
  res.redirect("/login");
});

app.get("/user/dashboard", (req, res) => {
  if (!req.session.user) {
    req.flash("error_msg", "Please log in to access the dashboard.");
    return res.redirect("/login");
  }

  const { name } = req.session.user;
  res.render("user/dashboard", { name });
});

app.get('/user/dashboard/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error occurred while logging out: ", err);
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/login');
    }
  });
});


app.listen(3000);
