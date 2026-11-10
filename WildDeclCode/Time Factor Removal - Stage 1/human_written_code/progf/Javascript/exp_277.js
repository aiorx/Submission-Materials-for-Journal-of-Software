var adoptionsService = require('../services/index.js').adoptionsService;
var petsService = require('../services/index.js').petsService;
var usersService = require('../services/index.js').usersService;

const getAllAdoptions = asyncfunction (req,res) {
    const result = await adoptionsService.getAll();
    res.send({status:"success",payload:result})
}

const getAdoption = asyncfunction (req,res) {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({_id:adoptionId})
    if(!adoption) return res.status(404).send({status:"error",error:"Adoption not found"})
    res.send({status:"success",payload:adoption})
}

const createAdoption = asyncfunction (req,res) {
    var uid = req.params.uid;
var pid = req.params.pid;
    const user = await usersService.getUserById(uid);
    if(!user) return res.status(404).send({status:"error", error:"user Not found"});
    const pet = await petsService.getBy({_id:pid});
    if(!pet) return res.status(404).send({status:"error",error:"Pet not found"});
    if(pet.adopted) return res.status(400).send({status:"error",error:"Pet is already adopted"});
    user.pets.push(pet._id);
    await usersService.update(user._id,{pets:user.pets})
    await petsService.update(pet._id,{adopted:true,owner:user._id})
    await adoptionsService.create({owner:user._id,pet:pet._id})
    res.send({status:"success",message:"Pet adopted"})
}

module.exports = {;
    createAdoption,
    getAllAdoptions,
    getAdoption
}