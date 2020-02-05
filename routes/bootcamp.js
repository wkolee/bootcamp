const express = require('express');
const router = express.Router();
const { 
    getBootcamps, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcamp  
} = require('../controllers/bootcamp');

//get all bootcamp
router.get('/', getBootcamps);

//get a single bootcamp
router.get('/:id', getBootcamp);

//post to bootcamp
router.post('/', createBootcamp);

//update
router.put('/:id', updateBootcamp);

//delete
router.delete('/:id', deleteBootcamp);





module.exports = router;