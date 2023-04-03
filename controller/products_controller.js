const products = require('../models/product');
const categories = require('../models/categories');
const subCategories = require('../models/sub_categories');
const { validationResult } = require('express-validator');

module.exports = {


    addCategories : async (req,res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            let data = new categories(req.body);
            let result = await data.save();
            console.log(result);

            const msfIfSuccess = "Categories Added Successfully !!";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }


    },

    getCategories : async (req,res) =>  {
        try {
            const categoriesData = await categories.find({});
            res.status(200).send({ success: true, data: categoriesData });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },


    deleteCategory: async (req, res) => {

        try {
            var id = req.params.id;
            const query = { _id: id };
            const result = await categories.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Category Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            }else{
                const msg = "No matched banner found ";
                res.status(201).send({ success: true, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },


    addSubCategories : async (req,res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            let reqData = req.body;

            const query = { _id: req.body.categoryId };
            console.log(query);
            console.log('-----------');
            const cat = await categories.find(query);
            console.log('Cat in sub ', cat);
            reqData.categoryData  = cat[0];

            console.log('FInal Obj => ', reqData);

            let data =  subCategories(reqData);
            let result = await data.save(); 
            console.log(result);

            const msfIfSuccess = "SubCategory Added Successfully !!";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: data });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }


    },


    getSubCategories : async (req,res) =>  {
        try {

            let id = req.query.id;
            let filterQuery = {};
            if(id != 'undefined' && id != ''){
             filterQuery = {categoryId: id};
            }

            console.log(filterQuery)
            const subCategoriesData = await subCategories.find(filterQuery);
            res.status(200).send({ success: true, data: subCategoriesData });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }
    },


    addProduct: async (req, res) => {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({ success: false, errors: errors.array()[0] });
            }

            let data = new products(req.body);
            let result = await data.save();
            console.log(result);

            const msfIfSuccess = "Product Added Successfully";
            res.status(200).send({ success: true, msg: msfIfSuccess, data: result });

        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },

    updateProduct: async (req, res) => {


    },

    getSingleProduct: async (req, res) => {

        try {
            var id = req.query.id;
            const query = { _id: id };
            const result = await products.find(query);

            if (result.length > 0) {
                const msg = "Product Found Successfully";
                res.status(200).send({ success: true, msg: msg, data: result[0] });
            } else {
                const msg = "No matched product found ";
                res.status(201).send({ success: true, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },


    productsByCategory: async (req, res) => {

        console.log(req.query);
        try {
            var id = req.query.categoryId;
            const query = { categoryId: id };
            const result = await products.find(query);

            if (result.length > 0) {
                const msg = "Product Found Successfully";
                res.status(200).send({ success: true, msg: msg, data: result });
            } else {
                const msg = "No matched product found ";
                res.status(201).send({ success: true, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },

    getProducts: async (req, res) => {
        try {
            const productsData = await products.find({});
            res.status(200).send({ success: true, data: productsData });
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },

    deleteProduct: async (req, res) => {

        try {
            var id = req.params.id;
            const query = { _id: id };
            const result = await products.deleteOne(query);
            if (result.deletedCount === 1) {
                const msg = "Product Deleted Successfully";
                res.status(200).send({ success: true, msg: msg, });
            } else {
                const msg = "No matched product found ";
                res.status(201).send({ success: true, msg: msg, });
            }
        } catch (error) {
            console.log("Error : ", error);
            res.status(400).send({ success: false, msg: error.message });
        }

    },

}