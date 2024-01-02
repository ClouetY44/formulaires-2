import express from "express";
import path from "path";
import bcrypt from "bcrypt"
import fs from "fs"

const app = express();
const PORT = 9000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "/src/views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("layout/main", { template: "../pages/home" });
});

app.get("/login", (req, res) => {
    res.render("layout/main", { template: "../pages/login" })
})

app.post("/home", (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err){
        console.log(err);
        return res.redirect("/")
    }

    console.log(hash)

    const userData = {
        username: req.body.username,
        password: hash
    }
    
    fs.readFile("./public/data.json", "utf8", (err, data) => {
        if (err) {
            console.error("erreur lors de la lecture :", err)
            return
        }

        let content = []

        content = JSON.parse(data)

        content.push(userData)

        console.log("contenu :", data)

        fs.writeFile("./public/data.json", JSON.stringify(content, null, 2), (err)=> {
            if (err) {
                console.error("erreur lors le l'écriture :", err)
                return
            }
            console.log("écriture réussi")
    
        })
    })

    console.log(req.body);
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
