import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db,auth} from "./firebase";
import { Button, makeStyles, Modal, Input } from "@material-ui/core"; 
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [user, setUser] = useState(null);
  const [openSignIn,setOpenSignIn]=useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user is logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      //perfome some cleanup action
      unsubscribe();
    };
  }, [user, username]);


  useEffect(() => {
    //this is where code runs
    db.collection("posts")
    .orderBy('timestamp','desc')
    //everytime a new post is added,this code fire
      .onSnapshot((snapshot) =>
        setPosts(snapshot.docs.map(doc =>({
          id:doc.id,
          post:doc.data()
        })))
      );
  }, []);

  const signUp =(event) =>{
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName:username
        })
      })
      .catch((error) => alert(error.message));

  }

  const signIn=(event)=>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };
   return (
    <div className="app">
    <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>REGISTER </Button>
          </form>
        </div>
      </Modal>
      <Modal 
       open={openSignIn} 
       onClose={() => setOpenSignIn(false)} 
       >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>SignIn</Button>
          </form>
        </div>
      </Modal>

        
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user?.displayName ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
         <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>   
        )}
      </div>
      < div className="app_posts">
        <div className="app_postsLeft">
          {  
          posts.map(({id,post}) =>(
          <Post key={id} postId={id} user={user} username={post.username.username} caption={post.caption} imageUrl={post.imageUrl}/>
          )
          )
          }
        </div>
        <div className="app_postsRight">
        <InstagramEmbed
        url="https://www.instagram.com/p/B_uf9dmAGPw/"  
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
        />
        </div>
      </div>

       

       
        {user?.displayName ?(
            <ImageUpload username={user.displayName} />
      ):(
        <h3 className="text">SORRY..!! LOGIN TO UPLOAD</h3>
      )
      }
      


    </div>
  );
}

export default App;
