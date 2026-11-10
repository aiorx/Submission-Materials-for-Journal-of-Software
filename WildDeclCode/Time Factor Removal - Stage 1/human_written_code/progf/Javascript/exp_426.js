/* Load Car Data Access Object */
var CarDao = require('../dao/carDao');

/* Load Controller Common function */
var ControllerCommon = require('./common/controllerCommon');

/* Load Car entity */
var Car = require('../model/car');

/**
 * Car Controller
 */
class CarController {

    constructor() {
        this.carDao = new CarDao();
        this.common = new ControllerCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params req, res
     * @return entity
     */
    findById(req, res) {
        var id = req.params.id;

        this.carDao.findById(id)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(res) {
        this.carDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll(res) {

        this.carDao.countAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(req, res) {
        var car = new Car();
        car.id = req.body.id;
        car.maker = req.body.maker;
        car.model = req.body.model;
        car.year = req.body.year;
        car.driver = req.body.driver;

        return this.carDao.update(car)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Creates the given entity in the database
     * @params req, res
     * returns database insertion status
     */
    create(req, res) {
        var car = new Car();
        if (req.body.id) {
            car.id = req.body.id;
        }
        car.maker = req.body.maker;
        car.model = req.body.model;
        car.year = req.body.year;
        car.driver = req.body.driver;

        if (req.body.id) {
            return this.carDao.createWithId(car)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }
        else {
            return this.carDao.create(car)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }

    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params req, res
     * returns database deletion status
     */
    deleteById(req, res) {
        var id = req.params.id;

        this.carDao.deleteById(id)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
    exists(req, res) {
        var id = req.params.id;

        this.carDao.exists(id)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}

module.exports = CarController;