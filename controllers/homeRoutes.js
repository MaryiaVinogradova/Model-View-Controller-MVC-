const router = require('express').Router();
const res = require('express/lib/response');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const  postData = await Post.findAll({
      include: [
        {model: User,
        attributes: ['name'],}
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      title: "Blog"
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  try {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }else {
    res.render('login', { 
      title: "Blog" 
    });
  }

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/signup', async (req, res) => {
  try {
    // If the user is already logged in, redirect the request to /profile
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
    
    else {
      res.render('signup', { 
        title: "Blog" 
      });
    }
  
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get('/profile', async (req, res) => {
    try {
      // Get all projects with user data
      if (req.session.logged_in === true) {
        const currentUserData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
          include: [{ model: Post }],
        });

      const postData = await Post.findAll({where: {user_id: req.session.user_id}, 
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
      // Serialize data so the template can read it
      const posts = postData.get({ plain: true });

      const user = currentUserData.get({plain: true});
      res.render('profile', {
        ...user,
        posts,
        logged_in: true,
        title: "Your blog"
      });
    } else{
      res.render('login', {
        title: "Blog"
      });
    }

    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/new-post', async (req, res) => {
    try {
      const currentUserData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        
      });
      const user = currentUserData.get({ plain: true });
      res.render('new-post', {  
        ...user,
        logged_in: req.session.logged_in,
        title: "Your blog" 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['name'],
          },
          {
            model: Comment,
            attributes: ['content', 'user_id', 'date_created'],
            include: [
              {
                model: User,
                attributes: ['name'],
              },]
          },
        ],
      });
      let user;
      if (req.session.logged_in === true) {
        const currentUserData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
        });
        user = currentUserData.get({ plain: true });
      }; 
      // Serialize data so the template can read it
      const posts = postData.get({ plain: true });
      let commentAry = [];
      commentAry.push(posts.comments);
      // Pass data to view
      res.render('postdetail', { 
        ...user,
        posts,
        commentAry, 
        logged_in: req.session.logged_in,
        title: "The Tech Blog"
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }); 

module.exports = router;
