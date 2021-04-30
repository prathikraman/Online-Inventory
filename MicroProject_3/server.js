const express = require('express')
var result;
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => {
console.log('listening on 3000')
}
); 
app.set('view engine', 'ejs')
app.use(express.static('public'))
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017'; 
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    console.log('Connected');
    db = client.db("Inventory");
    app.get('/', (req, res) => {
        db.collection('stock').find({}).toArray((err, result) => {
           
            res.render('index.ejs', { users: result });
        });

    });
app.get('/add',(req,res)=>{
    res.render('add.ejs');
})

app.post('/added',(req, res)=>{
    console.log(req.body.product_id);
        db.collection('stock').insertOne({
            'product_id' :req.body.product_id,
            "brand" : req.body.brand,
            "category":req.body.category,
            "name": req.body.name,
            "size": Number(req.body.size),
            "quantity": Number(req.body.quantity),
            "cost_price":Number(req.body.cost_price),
            "selling_price":Number(req.body.selling_price)},(err,result)=>{
                if(err)
                throw err;
                console.log("added");
                
            });
        
        res.redirect('/');
        console.log(req.body);
});
app.get('/delete',(req,res)=>{
    db.collection('stock').deleteOne({
    'product_id':req.query.pid 
    },(err,result)=>{
        if(err)
        throw err;
        console.log(req.query.pid);
        
    });
    res.redirect('/');
})
app.get('/edit', (req, res) => {
    db.collection('stock').find({}).toArray((err, result) => {
       
        res.render('edit.ejs', { users: result });
    });

});
app.post('/edited', (req, res) => {
    db.collection('stock').updateOne({
       'product_id':req.body.pid},{
           $set:{
            "quantity": req.body.newqty,
            "cost_price":Number(req.body.newcp),
            "selling_price":Number(req.body.newsp)
           }
       },(err,result)=>{
        if(err)
        throw err;
        console.log(req.query.pid);
        
    });
    res.redirect('/');
})
app.get('/sales', (req, res) => {
    db.collection('sales').find({}).toArray((err, result) => {
       
        res.render('sales.ejs', { users: result });
    });

});
app.get('/update', (req, res) => {
    
       
        res.render('saleadd.ejs' );
    

});
app.post('/saleadded',(req, res)=>{
    console.log(req.body.product_id);
       var date_ob = new Date(req.body.purchase_date);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            var time_date = date + "-" + month + "-" + year;
            db.collection('sales').insertOne({
                'purchase_date': time_date,
            
            'product_id' :req.body.product_id,
            "quantity": Number(req.body.quantity),
            "unit_price":Number(req.body.unit_price),
            "total_sales":Number(req.body.unit_price)*Number(req.body.quantity)});
        
        res.redirect('/sales');
        console.log(date_ob);
});

    });

