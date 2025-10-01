import bodyParser from "body-parser";
import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});


let blogPosts = [
    {id:1, title:"Artificial Intelligence: The Future is Here", content:"Artificial Intelligence (AI) is changing the way we live and work. From virtual assistants like Siri and Alexa to recommendation systems on Netflix and YouTube, AI is part of our daily routines. Businesses use it to automate tasks, farmers apply it to improve crop yields, and doctors rely on it for faster, more accurate diagnoses.While AI opens doors to innovation, it also raises concerns about ethics, job security, and data privacy. The challenge is to balance progress with responsibility.AI isn’t just about robots—it’s about smarter solutions that make life easier, more efficient, and more connected. As technology advances, AI will continue to shape the future of education, healthcare, business, and even governance, offering endless opportunities for growth."}
]

app.listen(port, ()=>{
    console.log(`Listening to server port ${port}`)
})


app.get("/", (req, res)=>{
    res.render("index.ejs")
})
app.get("/about", (req, res)=>{
    res.render("about.ejs")
})
app.get("/contact", (req, res)=>{
    res.render("contact.ejs")
})

app.get("/projects", (req, res)=>{
    res.render("projects.ejs")
})

app.get("/resume", (req, res)=>{
    res.render("resume.ejs")
})

app.get("/blog", (req, res)=>{
    res.render("blog.ejs", {blogPosts})
})

app.get("/new", (req, res)=>{
    res.render("new.ejs")
})

app.post("/new", (req, res)=>{
    const {title, content } = req.body
    const newPost = {id:blogPosts.length+1, title, content}
    blogPosts.push(newPost)
    res.redirect("/blog")
}

)

app.get("/edit/:id", (req,res)=>{
    const id = parseInt(req.params.id)
    const post = blogPosts.find(post=>post.id === id)
    res.render("edit", {post})
})


app.post("/edit/:id", (req,res)=>{
    const id = parseInt(req.params.id)
    const {title, content } = req.body
    const postIndex = blogPosts.findIndex(post=>post.id === id)
    blogPosts[postIndex] = {id, title, content}
    res.redirect("/blog")
})

app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  blogPosts = blogPosts.filter(post => post.id !== id);
  res.redirect('/');
});

// send mail
app.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Setup transporter (example using Gmail)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ngugitheman@gmail.com",      // 👈 replace with your Gmail
        pass: "stbd tvqk judq azdx"         // 👈 use an App Password (not your real Gmail password)
      }
    });

    // Email options
    let mailOptions = {
      from: email,
      to: "ngugitheman@gmail.com",          // 👈 your personal email
      subject: "New Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send("✅ Message sent successfully!");
  } catch (err) {
    console.error(err);
    res.send("❌ Failed to send message. Please try again.");
  }
});