var Modal = require('react-modal');
var FormEvent = require('react').FormEvent;
var useState = require('react').useState;
var closeImg = require('../../assets/close.svg');
var incomeImg = require('../../assets/income.svg');
var outcomeImg = require('../../assets/outcome.svg');
var useTransactions = require('../../hooks/useTransactions').useTransactions;
var Container = require('./styles').Container;
var TransactionTypeContainer = require('./styles').TransactionTypeContainer;
var RadioBox = require('./styles').RadioBox;

Modal.setAppElement('#root');

interface NewTransactionModalProps {
  isOpen: boolean; 
  onRequestClose: function () { return void; };
}

function NewTransactionModal({ isOpen, onRequestClose }: NewTransactionModalProps) {

  var createTransaction = useTransactions.createTransaction;();

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState('')
  const [type, setType] = useState('deposit');

  async function handleCreateNewTransaction(event: FormEvent) {
    event.preventDefault();
    await createTransaction({
      title,
      amount,
      category,
      type
    })
    setTitle('');
    setAmount(0);
    setCategory('');
    setType('deposit')
    onRequestClose();
  }

  return (
    <Modal 
      isOpen={ isOpen } 
      onRequestClose={ onRequestClose }
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button 
        type="button" 
        onClick={ onRequestClose} 
        className="react-modal-close"
      >
        <img src={ closeImg } alt="Fechar modal" />
       </button>
      <Container onSubmit={ handleCreateNewTransaction}>
        <h2>Cadastrar informação</h2>
        <input 
          placeholder="Título" 
          value={ title } 
          onChange={ function event { return setTitle(event.target.value); }}
        />
        <input 
          type="number" 
          placeholder="Valor"
          value={ amount } 
          onChange={ function event { return setAmount(Number(event.target.value)); }}
        />
        <TransactionTypeContainer>
          <RadioBox 
            type="button"
            onClick={ function () { setType('deposit') }}
            isActive={type === 'deposit'}
            activeColor="green"
          >
            <img src={ incomeImg } alt="Entrada" />
            <span>Entrada</span>
          </RadioBox>
          <RadioBox
            type="button"
            onClick={ function () { setType('withdraw') }}
            isActive={type === 'withdraw'}
            activeColor="red"
          >
            <img src={ outcomeImg } alt="Saída" />
            <span>Saída</span>
          </RadioBox>
        </TransactionTypeContainer>
        <input 
          placeholder="Categoria"
          value={ category } 
          onChange={ function event { return setCategory(event.target.value); }}
        />
        <button type="submit">Cadastrar</button>
      </Container>
    </Modal>
  )
}