const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers')

/* GET ALL PRODUCTS. */
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page  !== 0) ? req.query.page : 1; // set the current page number
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //set the limit per page

  let startValue;
  let endValue;

  if(page > 0) {
    startValue = (page * limit) - limit; // 0, 10, 20, 30 ...
    endValue = page * limit;
  }else {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category',
          'p.id',
          'p.title as name',
          'p.quantity',
          'p.price',
          'p.id',
          'p.image',
          'p.description'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
          if(prods.length > 0)
          {
              res.status(200).json({
                  count: prods.length,
                  products: prods
              })
          }else
          {
              res.json({
                  message: "No products found"
              })
          }
      })
      .catch(err => console.log(err))
});
/* GET SINGLE PRODUCT */
router.get('/:prodId', function(req, res){
    let productId = req.params.prodId;

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.id',
            'p.title as name',
            'p.quantity',
            'p.price',
            'p.id',
            'p.image',
            'p.images',
            'p.description'
        ])
        .filter({'p.id': productId})
        .get()
        .then(prod => {
            if(prod)
            {
                res.status(200).json(prod)
            }else
            {
                res.json({
                    message: `No product found with id ${productId}`
                })
            }
        })
        .catch(err => console.log(err))

});
/* GET ALL PRODUCTS FROM CATEGORY */
router.get('/category/:catName',function(req,res){
    let page = (req.query.page !== undefined && req.query.page  !== 0) ? req.query.page : 1; // set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //set the limit per page

    let startValue;
    let endValue;

    if(page > 0) {
        startValue = (page * limit) - limit; // 0, 10, 20, 30 ...
        endValue = page * limit;
    }else {
        startValue = 0;
        endValue = 10;
    }
    // get category title from param
    let c_title = req.params.catName;

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: `c.id = p.cat_id WHERE c.title LIKE '%${c_title}%'`
        }])
        .withFields(['c.title as category',
            'p.id',
            'p.title as name',
            'p.quantity',
            'p.price',
            'p.id',
            'p.image',
            'p.description'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if(prods.length > 0)
            {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                })
            }else
            {
                res.json({
                    message: `No products found from '${c_title}' category`
                })
            }
        })
        .catch(err => console.log(err))
});

module.exports = router;
