var _import = require('express');
var morgan = require('morgan');
var cors = require('cors');
var validateRequest = require('./validators/validateRequest').validateRequest;
var validateToken = require('./validators/validateToken').validateToken;
var AuthController = require('./controllers/AuthController');
var CampaignController = require('./controllers/campaignController');
var postLoginValidator = require('./validators/postLoginValidator').postLoginValidator;
var postUserValidator = require('./validators/postUserValidator').postUserValidator;
var postCampaignValidator = require('./validators/postCampaignValidator').postCampaignValidator;
var putCampaignValidator = require('./validators/putCampaignValidator').putCampaignValidator;
var postSendResetValidator = require('./validators/postSendResetValidator').postSendResetValidator;
var postResetPasswordValidator = require('./validators/postResetPasswordValidator').postResetPasswordValidator;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes for login
app.post('/auth/create', validateRequest(postUserValidator), AuthController.createUser);
app.post('/auth/login', validateRequest(postLoginValidator), AuthController.login);

app.post('/auth/send-reset', validateRequest(postSendResetValidator), AuthController.sendReset);
app.post('/auth/reset-password', validateRequest(postResetPasswordValidator), AuthController.resetPassword);
//app.post('/auth/change-password', validateRequest(postLoginValidator), AuthController.changePassword);

// Routes protected by token
app.use(validateToken);

app.get('/campaigns', CampaignController.getAllCampaigns);
app.post('/campaigns', validateRequest(postCampaignValidator), CampaignController.saveCampaign);
app.delete('/campaign/:id', CampaignController.deleteCampaign);

// For Cards
app.get('/campaigns/graphs/investment', CampaignController.getInvestiment);
app.get('/campaigns/graphs/revenues', CampaignController.getRevenue);
app.get('/campaigns/graphs/roi', CampaignController.getROI);

// Error Handling
app.use(function (error: any, req: Request, res: Response, _: NextFunction) {
    const httpCode = error.statusCode || error?.response?.status || 500;
    if (error.toJSON) {
        error = error.toJSON();
    }
    return res.status(httpCode).json(error);
});

app.listen(8000, function () {
    console.log('Servidor ouvindo na porta 8000...')
});
