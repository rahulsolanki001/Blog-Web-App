 var express   = require("express");
var mongoose  = require("mongoose");
var bodyParser= require("body-parser");
var methodOverride= require('method-override');
var expressSanitizer= require("express-sanitizer");
var  app       = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect('mongodb://localhost/blogs',{useNewUrlParser:true});
app.use(methodOverride('_method'));

var blogSchema=new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    date  : {type : Date, default: Date.now}
});

var blog=mongoose.model('blog',blogSchema);

/* blog.create({
    title : 'My cute dogs',
    image : 'https://media2.picsearch.com/is?X_aAYshezx-Xxvyc9BKOo6mQdgMB-0Nkf98L492vKJA&height=255',
    body  : 'These are my cute dogs and they are just awesome.Love them so much',
}); */

app.get('/',function(req,res){
    res.redirect('/blogs');
});

app.get('/blogs',function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render('index',{blogs:blogs});
        }
    });
});

app.get('/blogs/new',function(req,res){
    res.render('new');
});

app.post('/blogs',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render('new');
        }else{
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id',function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('show',{blog:foundblog});
        }
    });
});

app.get('/blogs/:id/edit',function(req, res) {
   blog.findById(req.params.id,function(err,foundblog){
       if(err){
           res.redirect('/blogs');
       }else{
           res.render('edit',{blog:foundblog});
       }
   });
});

app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/'+ req.params.id);
        }
    });
});

app.delete('/blogs/:id',function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/blogs' + req.params.id);
        }else{
            res.redirect('/blogs');
        }
        
    });
});

app.listen(process.env.PORT,process.env.IP);
     