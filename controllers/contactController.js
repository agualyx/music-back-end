const asyncHandler = require('express-async-handler');
const contact = require('../models/contactModel');


/**
 * @description Get all contacts
 * @route GET /api/contacts
 * @access private
 */

const getContacts = asyncHandler( async (req,res)=>{
    const { id } = req.user;
    const contacts = await contact.find({user_id:id});
    res.status(200).json({msg:contacts});
} )

/**
 * @description post contact
 * @route POST /api/contacts
 * @access public
 */

const postContact = asyncHandler( async (req,res)=>{
    const { name, phone, email } = req.body;
    if( !phone || !name || !email ){
        res.status(400);
        throw new Error('params invalid')
    }
    const insertData = await contact.create({
        name,
        phone,
        email,
        user_id:req.user.id
    })
    res.status(201).json({msg:insertData});
} )

/**
 * @description get contact from id
 * @route GET /api/contacts/:id
 * @access public
 */

const getContact = asyncHandler (async (req,res)=>{
    const contactInfo = await contact.findById(req.params.id);
    if(!contactInfo){
        res.status(404);
        throw new Error(`User don't exist!`);
    }
    res.status(200).json({msg:contactInfo});
})

/**
 * @description update contact with id 
 * @route PUT /api/contacts/:id
 * @access public
 */

const updateContact = asyncHandler ( async (req,res)=>{
    const contactInfo = contact.findById(req.params.id);
    if(!contactInfo){
        res.status(404);
        throw new Error('Update fail!');
    }
    const updateInfo = await contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json({msg:updateInfo});
} )

/**
 * @description delete contact from id
 * @route DELETE /api/contacts/:id
 * @access public
 */

const deleteContact = asyncHandler( async (req,res)=>{
    const deleteContact =await contact.findById(req.params.id);
    if(!deleteContact){
        res.status(404);
        throw new Error('Delete fail!');
    }
    const deleteData = await contact.findByIdAndRemove(req.params.id);
    res.status(200).json({msg:`Delete id = ${deleteData}`});
})

module.exports = {
    getContacts,
    postContact,
    getContact,
    updateContact,
    deleteContact
}