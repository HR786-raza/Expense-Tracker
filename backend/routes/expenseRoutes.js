const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');

router.get('/', controller.getAllExpenses);
router.get('/filter', controller.getExpensesByFilter);
router.post('/', controller.addExpense);
router.put('/:id', controller.updateExpense);
router.delete('/:id', controller.deleteExpense);
router.get('/export/excel', controller.exportToExcel);
router.get('/export/pdf', controller.exportToPDF);

module.exports = router;
