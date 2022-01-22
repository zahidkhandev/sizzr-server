const router = require('express').Router();
const verify = require('../../verifyToken');
const { getStoreStats, getAll, getStore, deleteStore, patchStore } = require('../controllers/store/vendor');

//GET ALL
router.get('/', getAll);

//GET USER STATS

router.get('/stats', verify, getStoreStats);

//UPDATE    
router.patch('/:id', verify, patchStore)

//DELETE

router.delete('/:id', verify, deleteStore);

//GET
router.get('/:id', getStore);


module.exports = router;
