var express = require('express');
var path = require('path');
var fs = require('fs');
var cors = require('cors');
var authRoutes = require('./routes/auth').authRoutes;
var mainRoutes = require('./routes/main').mainRoutes;

// DI 
var ClientInvoicesRepoAggregate = require('./repositories/clientInvoicesRepoAggregate').ClientInvoicesRepoAggregate;
var ClientsRepository = require('./repositories/clientsRepository').ClientsRepository;
var InvoicesRepository = require('./repositories/invoicesRepository').InvoicesRepository;
var UsersRepository = require('./repositories/usersRepository').UsersRepository;
var graphQLRoute = require('./graphql/main').graphQLRoute;


// export needed for unit/integration testing
const app = express()

app.use(function (req, res, next) {
    if (req.headers["access-control-request-private-network"]) {
        res.setHeader("access-control-allow-private-network", "true");
    }
    next(null);
})
app.use(cors())


// parse JSON when content type is application/json
app.use(express.json())

authRoutes(app)
mainRoutes(app)
graphQLRoute(app)

const setup = async function () {

    const dir = path.resolve(path.join(__dirname, '../public'))
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const publicPath = path.resolve(__dirname, '../public')
    app.use('/public', express.static(publicPath))

    const invoiceRepo = await InvoicesRepository.getInstance();
    app.set("invoicesRepo", invoiceRepo);
    const invoiceClientAggregate = await ClientInvoicesRepoAggregate.getInstance();
    app.set("invoiceClientAggregate", invoiceClientAggregate);
    const clientsRepo = await ClientsRepository.getInstance();
    app.set("clientsRepo", clientsRepo);
    const usersRepo = await UsersRepository.getInstance();
    app.set("usersRepo", usersRepo);
}