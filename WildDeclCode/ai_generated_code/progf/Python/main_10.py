from fastapi import FastAPI, Depends, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Annotated
from uuid import uuid4, UUID
from datetime import date, time
from pydantic import BaseModel
from random import choice
from fastapi.middleware.cors import CORSMiddleware


sqlite_url = f'sqlite:///database.db'

#Allows all threads (functions) to access database
connect_args = {"check_same_thread": False}

#Engine is used to connect API to database
engine = create_engine(sqlite_url, connect_args = connect_args)

def get_sesssion():
    with Session(engine) as session:
        yield session

#create session dependency
sessionDep = Annotated[Session, Depends(get_sesssion)]

#runs on startup, creates database and tables using engine
def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan= lifespan)


#Allow requests from all origins, origins would be specified in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#List Assisted using common GitHub development aids
staff_members = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Davis",
    "Dana Lee",
    "Evan Morgan",
    "Fiona Brown",
    "George Wilson",
    "Hannah Martin",
    "Ian Clark",
    "Jessica Turner"
]

class CustomerBase(BaseModel):
    username: str | None = Field(nullable= True)
    title : str
    first_name : str
    last_name: str
    email : str

#Model in table
class Customer(CustomerBase, SQLModel, table = True):
    id : UUID = Field(default_factory= uuid4, primary_key=True)
    password : str | None = Field(nullable= True)

#can be used for both cases as password cannot be updated after account creation
class CustomerPublicUpdate(CustomerBase):
    id: UUID

class CustomerCreate(CustomerBase):
    password : str | None = Field(nullable=True)

class AddressBase(BaseModel):
    unit_number : str | None = Field(nullable=True)
    line_1 : str
    line_2 : str | None = Field(nullable=True)
    city: str
    postcode : str

#Model in table
class Address(AddressBase, SQLModel, table = True):
    id : UUID = Field(default_factory=uuid4, primary_key= True)
    customer_id : UUID | None = Field(foreign_key= "customer.id", nullable=True)

class AddressPublicUpdate(AddressBase):
    id : UUID

class AddressCreate(AddressBase):
    customer_id : UUID | None = Field(nullable= True)

class AppointmentBase(BaseModel):
    date: date
    time: time
    staff_member : str | None = Field(nullable=True)
    appointment_type : str
    product : str
    consultation_id: UUID | None = Field(foreign_key= "appointment.id", nullable=True)
    address_id: UUID = Field(foreign_key= "address.id")

#Model in table
class Appointment(AppointmentBase, SQLModel, table = True):
    id : UUID = Field(default_factory=uuid4, primary_key= True)
    customer_id: UUID = Field(foreign_key= "customer.id")
    staff_member : str

class AppointmentCreate(AppointmentBase):
    customer_id: UUID = Field(foreign_key= "customer.id")

#can be used for both cases as customer id and address id cannot be changed after booking
class AppointmentPublicUpdate(AppointmentBase):
    id : UUID

@app.post('/CreateAccount', response_model= CustomerPublicUpdate)
def CreateAccount(account: CustomerCreate, session: sessionDep):
    account = Customer.model_validate(account)
    if account.username:
        #if another account has the same username, a HTTP exception is raised
        username = session.exec(select(Customer).where(Customer.username == account.username)).one_or_none()
        if username:
            raise HTTPException(400, 'Username is taken')
    account.password = hash(account.password)
    session.add(account)
    session.commit()
    session.refresh(account)
    return account

@app.get('/GetAccounts', response_model= list[CustomerPublicUpdate])
def GetAccounts(session: sessionDep):
    accounts = session.exec(select(Customer)).all()
    return accounts

@app.get('/GetAccount/{user_id}', response_model=CustomerPublicUpdate)
def GetOneAccount(user_id, session: sessionDep):
    try:
        user_id = UUID(user_id)
    except ValueError:
        raise HTTPException(400, 'Invalid UUID')
    account = session.exec(select(Customer).where(Customer.id == user_id)).one_or_none()
    if not account:
        raise HTTPException(404, 'User not found')
    return account

@app.get('/login')
def Login(username, password, session:sessionDep):
    account = session.exec(select(Customer).where(Customer.username == username)).one_or_none()
    if not account:
        raise HTTPException(404, 'User not found')
    if account.password == hash(password):
        return account.id
    else:
        raise HTTPException(400, 'Incorrect credentials')
    
@app.put('/updateAccount', response_model=CustomerPublicUpdate)
def UpdateAccount(account: CustomerPublicUpdate, session: sessionDep):
    toUpdate = session.exec(select(Customer).where(Customer.id == account.id)).one_or_none()
    if not toUpdate:
        raise HTTPException(404, 'User not found')
    account = account.model_dump(exclude_unset=True)
    toUpdate.sqlmodel_update(account)
    session.add(toUpdate)
    session.commit()
    session.refresh(toUpdate)
    return toUpdate


@app.post('/CreateAddress', response_model= AddressPublicUpdate)
def CreateAddress(address: AddressCreate, session:sessionDep):
    address = Address.model_validate(address)
    if address.customer_id:
        #checks customer_id belongs to a customer in database
        account = session.exec(select(Customer).where(Customer.id == address.customer_id)).one_or_none()
        if not account:
            raise HTTPException(404, 'User not found')
    session.add(address)
    session.commit()
    session.refresh(address)
    return address

@app.get('/GetAddresses', response_model=list[AddressPublicUpdate])
def GetAddresses(session: sessionDep):
    addresses = session.exec(select(Address)).all()
    return addresses

@app.get('/GetAddress/{address_id}', response_model=AddressPublicUpdate)
def GetOneAddress(address_id, session: sessionDep):
    try:
        address_id = UUID(address_id)
    except ValueError:
        raise HTTPException(400, 'Invalid UUID')
    address = session.exec(select(Address).where(Address.id == address_id)).one_or_none()
    if not address:
        raise HTTPException(404, 'Address not found')
    return address

#Only get addresses that belong to a specified customer
@app.get('/GetCustomerAddress/{customer_id}', response_model=list[AddressPublicUpdate])
def GetCustomerAddress(customer_id, session: sessionDep):
    customer_id = UUID(customer_id)
    addresses = session.exec(select(Address).where(Address.customer_id == customer_id)).all()
    if not addresses:
        return []
    return addresses

@app.post('/CreateAppointment', response_model= AppointmentPublicUpdate)
def CreateAppointment(appointment : AppointmentCreate, session: sessionDep):
    #get random staff member from list
    appointment.staff_member = choice(staff_members)
    appointment = Appointment.model_validate(appointment)
    #checks consultation id is valid when appointment type is installation
    if appointment.appointment_type == 'Installation' or appointment.appointment_type == 'installation':
        if appointment.consultation_id == None:
            raise HTTPException(400, 'Consultation required')
        else:
            consultation = session.exec(select(Appointment).where(Appointment.id == appointment.consultation_id)).one_or_none()
            if not consultation:
                raise HTTPException(404, 'Consultation not found')
            if consultation.appointment_type != 'Consultation' and consultation.appointment_type != 'consultation' :
                raise HTTPException(400, 'Appointment type must be consultation')
            appointment.staff_member = consultation.staff_member
    elif appointment.appointment_type == 'Consultation' or appointment.appointment_type == 'consultation':
        #sets consultation_id to none if appointment type is consultation
        appointment.consultation_id = None
    else:
        raise HTTPException(400, 'Appointment type must be consultation or installation')
    #checks customer id is valid
    customer = session.exec(select(Customer).where(Customer.id == appointment.customer_id)).one_or_none()
    if not customer:
        raise HTTPException(404, 'Customer not found')
    #checks address id is valid
    address = session.exec(select(Address).where(Address.id == appointment.address_id)).one_or_none()
    if not address:
        raise HTTPException(404, 'Address not found')  
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment

@app.get('/GetAppointments', response_model=list[AppointmentPublicUpdate])
def GetAppointments(session: sessionDep):
    appointments = session.exec(select(Appointment)).all()
    return appointments

@app.get('/GetAppointment/{appointment_id}', response_model=AppointmentPublicUpdate)
def GetOneAppointment(appointment_id, session:sessionDep):
    appointment_id = UUID(appointment_id)
    appointment = session.exec(select(Appointment).where(Appointment.id == appointment_id)).one_or_none()
    if not appointment:
        raise HTTPException(404, 'Appointment not found')
    return appointment

#Only get appointments which belong to specified customer
@app.get('/GetCustomerAppointment/{customer_id}', response_model=list[AppointmentPublicUpdate])
def GetCustomerAppointment(customer_id, session: sessionDep):
    customer_id = UUID(customer_id)
    customer = session.exec(select(Customer).where(Customer.id == customer_id)).one_or_none()
    if not customer:
        raise HTTPException(404, 'User does not exist')
    appointments = session.exec(select(Appointment).where(Appointment.customer_id == customer_id)).all()
    return appointments