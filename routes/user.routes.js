const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { permissionMiddleware } = require('../middleware/auth.middleware');

router.get('/test', (req, res) => {
    res.status(200).json({
        sucess: true,
        message: 'User route is working'
    });
})

router.post('/test', (req, res) => {
    res.status(200).json({
        sucess: true,
        message: 'User route is working'
    })
})

// Public APIs
router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get('/students',authMiddleware,permissionMiddleware("Student", "Teacher"),userController.getAllStudents);

router.get('/students/:id',authMiddleware, permissionMiddleware("Student", "Teacher"),userController.getStudentById );

router.get('/teachers',authMiddleware, permissionMiddleware("Teacher"), userController.getAllTeachers );

router.get('/teachers/:id', authMiddleware, permissionMiddleware("Teacher"), userController.getTeacherById );

router.patch('/profile', authMiddleware, permissionMiddleware("Student", "Teacher"), userController.updateProfile);

router.patch('/students/:id', authMiddleware, permissionMiddleware("Teacher"), userController.updateStudent );

module.exports = router;