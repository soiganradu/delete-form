import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';
import './App.css';
import {generatePin, deleteAccount} from './app';

function App() {
  const [emailValid, setEmailValid] = useState(true);
  const [pinValid, setPinValid] = useState(true);
  const [description, setDescription] = useState("Please provide your account email address in the designated field below");
  const [isLoading, setIsLoading] = useState(false);
  const [codeIsLoading, setCodeIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [callSuccessfull, setCallSuccessfull] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState();
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [showSubmit, setShowSubmit] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasError(false);
    const form = event.currentTarget;
    const emailInput = form.elements[0].value;
    const pinInput = form.elements[1].value;

    var emailValid = false;
    var pinValid = false;
    if(email == ""){
      emailValid = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(emailInput)
      pinValid = true;
      setEmailValid(emailValid);
    }else{
      emailValid = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(emailInput)
      pinValid = /^[0-9]{6}$/.test(pinInput);
      setEmailValid(emailValid);
      setPinValid(pinValid);
    }

    if(emailValid && pinValid){
      if(email == ""){
        callGeneratePin(emailInput, true, true);
      }else{
        callDeleteAccount(pinInput);
      }
    }
  };

  const callGeneratePin= (email, showSubmit, isLoading) => {
    setShowSubmit(showSubmit);
    setCodeIsLoading(true);
    setIsLoading(isLoading);

    generatePin(email).then(({responseCode, flowErrors, validationErrors}) => {
      setShowSubmit(true);
      setCodeIsLoading(false);
      setIsLoading(false);

      if(responseCode == 0){
        setEmail(email);
        setDescription("Enter your 6 digit pin code that you received on email");
        setCountdown(120);
        setIsCounting(true);
      }else{
        setHasError(true);
        if (flowErrors != null && flowErrors.length != 0) {
          setError(flowErrors[0]);
        }
        if (validationErrors != null && validationErrors.length != 0) {
          setError("Email address is invalid");
        }
      }
    }).catch(() => {
      setShowSubmit(true);
      setCodeIsLoading(false);
      setIsLoading(false);
      setHasError(true);
      setError("Something went wrong, please try again later!");
    });
  }

  const callDeleteAccount= (pin) => {
    setIsLoading(true);

    deleteAccount(email, pin).then(({responseCode, flowErrors, validationErrors}) => {
      setIsLoading(false);
      if(responseCode == 0){
        setCallSuccessfull(true);
      }else{
        setHasError(true);
        if (flowErrors != null && flowErrors.length != 0) {
          setError(flowErrors[0]);
        }
        if (validationErrors != null && validationErrors.length != 0) {
          setError("Invalid pin code!");
        }
      }
    }).catch(() => {
      setIsLoading(false);
      setHasError(true);
      setError("Something went wrong, please try again later!");
    });
  }

  const startCountdown = () => {
    callGeneratePin(email, false, false);
  };

  useEffect(() => {
    let timer;
    if (isCounting) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 0) {
            clearInterval(timer);
            setIsCounting(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isCounting]);

  return (
      <div className="centered">
        <Card className="main-card">
          <Card.Body>
            <h4>Delete account</h4>
            {
              !callSuccessfull ?
                (
                  <>
                    {
                      !hasError ? 
                      (
                        <p className="description">{description}</p>
                      )
                      :
                      (
                        <p className="error-description">{error}</p>
                      )
                    }
                    <Form className="app-form" onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control required type="text" placeholder="Enter your email" disabled={isLoading || email != ""}/>
                        {!emailValid ? (<p className="validation-error">Email address invalid</p>) : <></>}
                      </Form.Group>
                      {
                        email != "" ? 
                        (
                        <Form.Group className="mb-3" controlId="formPin">
                          <InputGroup>
                            <Form.Control type="text" placeholder="Enter pin code" aria-describedby="basic-addon2" disabled={isLoading}/>
                            {
                              !isLoading ?
                              (
                                <Button variant="outline-primary" id="button-addon2" onClick={startCountdown} disabled={isCounting || codeIsLoading}>
                                  {!codeIsLoading ? (isCounting ? `${countdown} sec` : 'Send again') : (<div className="loader">
                                    <Spinner animation="border" role="status" className="send-spinner">
                                      <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                  </div>)}
                               </Button>
                              )
                              :
                              (
                                <></>
                              )
                            }

                          </InputGroup>
                          {!pinValid ? (<p className="validation-error">Pin code invalid</p>) : <></>}
                        </Form.Group>
                        ) : <></>
                      }
                      {
                        showSubmit ? 
                        (
                          !isLoading ? (              
                            <Button variant="primary" type="submit">
                              Submit
                            </Button>
                            ) : 
                            ( 
                              <div className="loader">
                                <Spinner animation="border" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </Spinner>
                              </div>
                            )
                        )
                            :
                            <></>
                      }
                    </Form>
                  </>
                )
              : 
              (
                <p className="success-description">{'Your account has been successfully deleted. Don\'t forget to also cancel your subscription if you haven\'t done so already. Thank you!'}</p>
              )
            }

          </Card.Body>
        </Card>
      </div>
  );
}

export default App
