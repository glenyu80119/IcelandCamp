var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require('../middleware/index.js');

router.get('/', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user});
        }
    });
});


// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    Campground.create({
        name: name,
        image: image,
        price: price,
        description: description,
        author: author,
    }, function(err, newcampground){
        if(err){
            console.log(err);
        }else{
            console.log(newcampground);
            res.redirect('/campgrounds');
        }
    });
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// SHOW ROUTE
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect('/campgrounds');
       }else{
           res.redirect(/campgrounds/ + req.params.id);
       }
   });
});

// DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
    
});


module.exports = router;