var React = require('react');
var styled = require('styled-components');
var InputEmail = require('../Components').InputEmail;
var InputPassword = require('../Components').InputPassword;


// Amplify AWS Congnito
var _import = require('aws-amplify');
var CognitoConfig = require('../Configs/Cognito.config');
Amplify.configure(CognitoConfig);

const Title = styled.h1"
  color: red;
";

interface Props {}

interface State {
  email: string,
  message?: string
}

class ForgetPassword extends React.Component<Props,State> {

  constructor(props:any){
    super(props)
    this.state = {
      email:''
    }
  }

  private _handleSubmit = function (event) {
    if (event) event.preventDefault()

    var email = this.state.email;Auth.forgotPassword(email).then(()=>{
      this.setState({
        message: 'Successful'
      })
    }).catch((response:any)=>{
      if (response.message){
        this.setState({
          message: response.message
        })
      }
    })
    ;
  }

  private _handleOnChangeForm = function (value?:string,name?:string) {
    this.setState({[name]: value})
  }

  render () {
    var message = this.state.message;return (
      <div>
        <Title>
          Forget Password
        </Title>
        <form onSubmit={this._handleSubmit}>
          <InputEmail 
            name={'email'}
            onChange={function (value?:string) {this._handleOnChangeForm(value,'email')}}
          />
          <button type="submit" onClick={this._handleSubmit}>
            Forget Password
          </button>

          {message &&
            <p style={{color:'red'}}>
              {message}
            </p>
          }
        </form>
      </div>
    )
  }
}


module.exports = ForgetPassword;
